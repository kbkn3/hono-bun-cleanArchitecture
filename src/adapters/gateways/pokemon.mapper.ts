import type { Pokemon } from "@/application/repositories/pokemon/pokemon.model";
import { ApplicationStatusError, Status } from "@/domain/error";

interface NamedRef {
  name: string;
  url: string;
}

/**
 * PokeAPIレスポンスからドメインモデルへの変換
 * 外部APIのスキーマ知識をAdapters層に閉じ込めるAnti-Corruption Layer
 */
export class PokeApiMapper {
  static toDomain(result: Record<string, unknown>): Pokemon {
    this.validate(result);

    const sprites = this.extractObject(result.sprites);
    const frontDefault = sprites?.front_default;

    return {
      id: result.id as number,
      name: result.name as string,
      baseExperience: typeof result.base_experience === "number" ? result.base_experience : 0,
      height: result.height as number,
      weight: result.weight as number,
      types: (result.types as { type: NamedRef }[]).map(t => t.type.name),
      abilities: (result.abilities as { ability: NamedRef }[]).map(a => a.ability.name),
      spriteUrl: typeof frontDefault === "string" ? frontDefault : null,
    };
  }

  private static validate(result: Record<string, unknown>): void {
    if (
      typeof result.id !== "number" ||
      typeof result.name !== "string" ||
      typeof result.height !== "number" ||
      typeof result.weight !== "number" ||
      !Array.isArray(result.types) ||
      !Array.isArray(result.abilities) ||
      !result.types.every((t: unknown) => this.hasNamedRef(t, "type")) ||
      !result.abilities.every((a: unknown) => this.hasNamedRef(a, "ability"))
    ) {
      throw new ApplicationStatusError(
        "Invalid response schema from PokeAPI",
        Status.SYSTEM_ERROR
      );
    }
  }

  private static hasNamedRef(value: unknown, key: string): boolean {
    if (!value || typeof value !== "object") return false;
    const record = value as Record<string, unknown>;
    const ref = record[key];
    if (!ref || typeof ref !== "object") return false;
    const namedRef = ref as Record<string, unknown>;
    return typeof namedRef.name === "string" && typeof namedRef.url === "string";
  }

  private static extractObject(value: unknown): Record<string, unknown> | null {
    if (value != null && typeof value === "object") {
      return value as Record<string, unknown>;
    }
    return null;
  }
}
