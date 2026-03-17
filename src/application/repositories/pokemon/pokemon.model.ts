import type { PokemonId } from "@/domain/pokemon/pokemon.id";

/**
 * ポケモンの検索条件
 */
export interface PokemonGetByIdCondition {
  id: PokemonId;
}

export interface PokemonRepositoryDto {
  pokemon: Pokemon;
}

/**
 * ポケモンの情報
 * Application層が必要とするフィールドのみを定義する。
 * 外部API (PokeAPI) のスキーマとの変換はAdapters層（Gateway）が担う。
 */
export interface Pokemon {
  id: number;
  name: string;
  baseExperience: number;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  spriteUrl: string | null;
}
