import type { PokemonRepository } from "@/application/repositories/pokemon/pokemon";
import {
  Pokemon,
  PokemonGetByIdCondition,
  PokemonRepositoryDto,
} from "@/application/repositories/pokemon/pokemon.model";
import { injectable } from "inversify";
import { ApplicationStatusError, Status } from "@/domain/error";

@injectable()
export class PokemonImpl implements PokemonRepository {
  async getById(condition: PokemonGetByIdCondition): Promise<PokemonRepositoryDto> {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${condition.id.toNumber()}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new ApplicationStatusError(
            `Pokemon with ID ${condition.id.toNumber()} not found`,
            Status.NOT_FOUND
          );
        }
        throw new ApplicationStatusError(
          `Failed to fetch Pokemon data: ${response.statusText}`,
          Status.BFF_SYSTEM_ERROR
        );
      }
      
      const result = await response.json();
      return { pokemon: convertResult(result) };
    } catch (error) {
      // ApplicationStatusErrorはそのまま再スロー
      if (error instanceof ApplicationStatusError) {
        throw error;
      }
      
      // その他のエラーはBFF_SYSTEM_ERRORとして包む
      console.error("Error fetching Pokemon data:", error);
      throw new ApplicationStatusError(
        `Error fetching Pokemon data: ${error instanceof Error ? error.message : String(error)}`,
        Status.BFF_SYSTEM_ERROR
      );
    }
  }
}

function convertResult(result: any): Pokemon {
  return {
    id: result.id,
    name: result.name,
    base_experience: result.base_experience,
    height: result.height,
    is_default: result.is_default,
    order: result.order,
    weight: result.weight,
    abilities: result.abilities,
    forms: result.forms,
    game_indices: result.game_indices,
    held_items: result.held_items,
    location_area_encounters: result.location_area_encounters,
    moves: result.moves,
    sprites: result.sprites,
    species: result.species,
    stats: result.stats,
    types: result.types,
    past_types: result.past_types,
  };
}
