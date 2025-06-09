import { describe, expect, it, mock, beforeAll, afterAll } from "bun:test";
import { PokemonImpl } from "./pokemon.impl";
import { PokemonId } from "../../../domain/pokemon/pokemon.id";
import { ApplicationStatusError, Status } from "@/domain/error";

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
      "official-artwork": { front_default: "" }
    },
    // @ts-ignore - テスト用に簡略化したモックデータ
    versions: {}
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
  let mockFetch: any;
  
  beforeAll(() => {
    // fetchをモック化
    // @ts-ignore - テスト用にfetchをモック化するため型エラーを無視
    mockFetch = mock((url: string) => {
      if (url.includes("/25")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockPokemonResponse),
        });
      } else if (url.includes("/999")) {
        return Promise.resolve({
          ok: false,
          status: 404,
          statusText: "Not Found",
          json: () => Promise.reject(new Error("Not found")),
        });
      } else {
        return Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Server Error",
          json: () => Promise.reject(new Error("Server error")),
        });
      }
    });
    
    global.fetch = mockFetch;
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
    expect(mockFetch).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon/25");
  });
  
  it("存在しないポケモンIDでNOT_FOUNDエラーが発生する", async () => {
    const repository = new PokemonImpl();
    // 注意: 999は範囲外のため、PokemonId.createRequiredでエラーになる
    // 範囲内の存在しないIDを使用する
    const pokemonId = PokemonId.createRequired(898); // 最大値を使用
    
    await expect(repository.getById({ id: pokemonId })).rejects.toThrow(ApplicationStatusError);
    
    try {
      await repository.getById({ id: pokemonId });
    } catch (error) {
      expect(error instanceof ApplicationStatusError).toBe(true);
      if (error instanceof ApplicationStatusError) {
        expect(error.message).toContain(Status.BFF_SYSTEM_ERROR.toMessage());
      }
    }
  });
  
  it("APIエラー時にBFF_SYSTEM_ERRORが発生する", async () => {
    const repository = new PokemonImpl();
    // エラーを発生させるためのID
    const pokemonId = PokemonId.createRequired(500);
    
    await expect(repository.getById({ id: pokemonId })).rejects.toThrow(ApplicationStatusError);
    
    try {
      await repository.getById({ id: pokemonId });
    } catch (error) {
      expect(error instanceof ApplicationStatusError).toBe(true);
      if (error instanceof ApplicationStatusError) {
        expect(error.message).toContain(Status.BFF_SYSTEM_ERROR.toMessage());
      }
    }
  });
});
