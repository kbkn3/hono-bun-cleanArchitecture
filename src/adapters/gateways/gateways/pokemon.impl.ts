import { PokemonRepository } from "@/application/repositories/pokemon/pokemon";
import {
  Pokemon,
  PokemonGetByIdCondition,
  PokemonRepositoryDto,
} from "@/application/repositories/pokemon/pokemon.model";
import { injectable } from "inversify";
// import { PokemonClient } from "pokenode-ts";

@injectable()
export class PokemonImpl implements PokemonRepository {
  // private client: PokemonClient;

  // constructor() {
  //   this.client = new PokemonClient();
  // }

  async getById(condition: PokemonGetByIdCondition): Promise<PokemonRepositoryDto> {
    // 現状bunはaxiosが使えない
    // try {
    //   const result = await this.client
    //     .getPokemonById(condition.id.toNumber())
    //   console.log(result.name);

    //   return { pokemon: convertResult(result) };
    // } catch (e) {
    //   throw new Error(e);
    // }
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${condition.id.toNumber()}`);
    const result = await response.json();
    return { pokemon: convertResult(result) };
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
