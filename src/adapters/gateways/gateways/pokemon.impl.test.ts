import { describe, expect, it, mock, beforeAll, afterAll } from "bun:test";
import { PokemonImpl } from "./pokemon.impl";
import { PokemonId } from "../../../domain/pokemon/pokemon.id";

// モックレスポンス
const mockPokemonResponse = {
  id: 25,
  name: "pikachu",
  base_experience: 112,
  height: 4,
  is_default: true,
  order: 35,
  weight: 60,
  abilities: [
    {
      ability: { name: "static", url: "https://pokeapi.co/api/v2/ability/9/" },
      is_hidden: false,
      slot: 1,
    },
  ],
  forms: [{ name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon-form/25/" }],
  game_indices: [],
  held_items: [],
  location_area_encounters: "https://pokeapi.co/api/v2/pokemon/25/encounters",
  moves: [],
  sprites: {
    front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    back_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png",
    front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png",
    back_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/25.png",
    other: {
      dream_world: { front_default: "", front_female: null },
      home: { front_default: "", front_female: null, front_shiny: "", front_shiny_female: null },
      "official-artwork": { front_default: "", front_shiny: "" }
    },
    versions: {
      "generation-i": {},
      "generation-ii": {},
      "generation-iii": {},
      "generation-iv": {},
      "generation-v": {},
      "generation-vi": {},
      "generation-vii": {},
      "generation-viii": {}
    },
  },
  species: { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon-species/25/" },
  stats: [],
  types: [
    {
      slot: 1,
      type: { name: "electric", url: "https://pokeapi.co/api/v2/type/13/" },
    },
  ],
  past_types: [],
};

describe("PokemonImpl", () => {
  // fetchのモック
  const originalFetch = global.fetch;
  
  beforeAll(() => {
    // fetchをモック化
    // @ts-ignore - テスト用にfetchをモック化するため型エラーを無視
    global.fetch = mock(() => {
      return Promise.resolve({
        json: () => Promise.resolve(mockPokemonResponse),
      });
    });
  });
  
  afterAll(() => {
    // テスト後に元に戻す
    global.fetch = originalFetch;
  });
  
  it("getByIdでポケモン情報を取得できる", async () => {
    const repository = new PokemonImpl();
    const pokemonId = PokemonId.createRequired(25);
    
    const result = await repository.getById({ id: pokemonId });
    
    expect(result.pokemon.id).toBe(25);
    expect(result.pokemon.name).toBe("pikachu");
    expect(result.pokemon.base_experience).toBe(112);
    expect(result.pokemon.height).toBe(4);
    expect(result.pokemon.weight).toBe(60);
    expect(result.pokemon.types[0].type.name).toBe("electric");
    
    // fetchが正しいURLで呼ばれたことを確認
    expect(global.fetch).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon/25");
  });
});
