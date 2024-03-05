import {
  PokemonGetByIdCondition,
  PokemonRepositoryDto,
} from "@/application/repositories/pokemon/pokemon.model";

export interface PokemonRepository {
  /**
   * ポケモンの情報を図鑑番号から取得する
   * @param condition
   */
  getById(condition: PokemonGetByIdCondition): Promise<PokemonRepositoryDto>;
}
