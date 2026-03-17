import type { PokemonRepository } from "@/application/repositories/pokemon/pokemon";
import type {
  PokemonGetByIdCondition,
  PokemonRepositoryDto,
} from "@/application/repositories/pokemon/pokemon.model";
import type { ILogger } from "@/application/logger/logger";
import { ApplicationStatusError, Status } from "@/domain/error";
import { PokeApiMapper } from "@/adapters/gateways/pokemon.mapper";

export class PokemonImpl implements PokemonRepository {
  private static readonly REQUEST_TIMEOUT_MS = 5000;

  constructor(
    private logger: ILogger
  ) {}

  async getById(condition: PokemonGetByIdCondition): Promise<PokemonRepositoryDto> {
    const idNumber = condition.id.toNumber();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PokemonImpl.REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${idNumber}`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new ApplicationStatusError(
            `Pokemon with ID ${idNumber} not found`,
            Status.NOT_FOUND
          );
        }
        this.logger.error(`PokeAPI returned ${response.status}: ${response.statusText}`);
        throw new ApplicationStatusError(
          "Failed to fetch Pokemon data",
          Status.SYSTEM_ERROR
        );
      }

      const result = await response.json() as Record<string, unknown>;
      return { pokemon: PokeApiMapper.toDomain(result) };
    } catch (error) {
      if (error instanceof ApplicationStatusError) {
        throw error;
      }

      // AbortControllerによるタイムアウトを通信エラーと区別する
      if (error instanceof DOMException && error.name === "AbortError") {
        this.logger.error("PokeAPI request timed out");
        throw new ApplicationStatusError(
          "Pokemon API request timed out",
          Status.SYSTEM_ERROR
        );
      }

      this.logger.error("Error fetching Pokemon data", error instanceof Error ? error : undefined);
      throw new ApplicationStatusError(
        "Failed to fetch Pokemon data",
        Status.SYSTEM_ERROR
      );
    } finally {
      clearTimeout(timeout);
    }
  }
}
