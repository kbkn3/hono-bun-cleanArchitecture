import type { PokemonId } from "@/domain/pokemon/pokemon.id";

export interface PokemonIdInputPort {
  handle(input: PokemonIdInputUseCaseDto): Promise<PokemonIdOutputUseCaseDto>;
}

export interface PokemonIdInputUseCaseDto {
  /** 図鑑番号 */
  pokemonId: PokemonId;
}

interface PokemonIdOutputUseCaseDtoParams {
  id: number;
  name: string;
  baseExperience: number;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  spriteUrl: string | null;
}

/**
 * ポケモン取得ユースケースの出力DTO
 * ビジネスロジックが必要とするフィールドのみを含む。
 */
export class PokemonIdOutputUseCaseDto {
  readonly id: number;
  readonly name: string;
  readonly baseExperience: number;
  readonly height: number;
  readonly weight: number;
  readonly types: string[];
  readonly abilities: string[];
  readonly spriteUrl: string | null;

  constructor(params: PokemonIdOutputUseCaseDtoParams) {
    this.id = params.id;
    this.name = params.name;
    this.baseExperience = params.baseExperience;
    this.height = params.height;
    this.weight = params.weight;
    this.types = params.types;
    this.abilities = params.abilities;
    this.spriteUrl = params.spriteUrl;
  }
}
