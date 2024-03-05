import { PokemonId } from "@/domain/pokemon/pokemon.id";
import { NamedAPIResource, PokemonAbility, PokemonHeldItem, PokemonMove, PokemonPastType, PokemonSprites, PokemonStat, PokemonType, VersionGameIndex } from "pokenode-ts";

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
 * interfaceの各項目は面倒なので、pokenode-tsからコピー/importしている
 */
export interface Pokemon {
  /** The identifier for this resource */
  id: number;
  /** The name for this resource */
  name: string;
  /** The base experience gained for defeating this Pokémon */
  base_experience: number;
  /** The height of this Pokémon in decimetres */
  height: number;
  /** Set for exactly one Pokémon used as the default for each species */
  is_default: boolean;
  /** Order for sorting. Almost national order, except families are grouped together */
  order: number;
  /** The weight of this Pokémon in hectograms */
  weight: number;
  /** A list of abilities this Pokémon could potentially have */
  abilities: PokemonAbility[];
  /** A list of forms this Pokémon can take on */
  forms: NamedAPIResource[];
  /** A list of game indices relevent to Pokémon item by generation */
  game_indices: VersionGameIndex[];
  /** A list of items this Pokémon may be holding when encountered */
  held_items: PokemonHeldItem[];
  /** A link to a list of location areas, as well as encounter details pertaining to specific versions */
  location_area_encounters: string;
  /** A list of moves along with learn methods and level details pertaining to specific version groups */
  moves: PokemonMove[];
  /** A set of sprites used to depict this Pokémon in the game.
   * A visual representation of the various sprites can be found at [PokeAPI/sprites](https://github.com/PokeAPI/sprites#sprites)
   */
  sprites: PokemonSprites;
  /** The species this Pokémon belongs to */
  species: NamedAPIResource;
  /** A list of base stat values for this Pokémon */
  stats: PokemonStat[];
  /** A list of details showing types this Pokémon has */
  types: PokemonType[];
  /** Data describing a Pokemon's types in a previous generation. */
  past_types: PokemonPastType[];
}
