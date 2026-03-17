import { describe, expect, it, mock, beforeAll, afterAll, afterEach } from "bun:test";
import { PokemonImpl } from "./pokemon.impl";
import { PokemonId } from "../../domain/pokemon/pokemon.id";
import { ApplicationStatusError, Status } from "@/domain/error";
import type { ILogger } from "@/application/logger/logger";

// モックLogger
function createMockLogger(): ILogger {
  return {
    info: mock(() => {}),
    warn: mock(() => {}),
    error: mock(() => {}),
    debug: mock(() => {}),
  };
}

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
  let mockLogger: ILogger;

  beforeAll(() => {
    mockLogger = createMockLogger();
    // fetchをモック化
    // @ts-ignore - テスト用にfetchをモック化するため型エラーを無視
    mockFetch = mock((url: string) => {
      if (url.includes("/25")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockPokemonResponse),
        });
      } else if (url.includes("/999") || url.includes("/898")) {
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

  afterEach(() => {
    // 各テスト後にfetchを確実に復元する
    global.fetch = mockFetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("getByIdでポケモン情報を取得できる", async () => {
    const repository = new PokemonImpl(mockLogger);
    const pokemonId = PokemonId.createRequired(25);

    const result = await repository.getById({ id: pokemonId });

    expect(result.pokemon.id).toBe(25);
    expect(result.pokemon.name).toBe("pikachu");
    expect(result.pokemon.baseExperience).toBe(112);
    expect(result.pokemon.height).toBe(4);
    expect(result.pokemon.weight).toBe(60);
    expect(result.pokemon.types).toEqual(["electric"]);
    expect(result.pokemon.abilities).toEqual(["static"]);
    expect(result.pokemon.spriteUrl).toBe("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png");

    // fetchが正しいURLで呼ばれたことを確認
    const callArgs = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(callArgs[0]).toBe("https://pokeapi.co/api/v2/pokemon/25");
    expect(callArgs[1].signal).toBeInstanceOf(AbortSignal);
  });

  it("存在しないポケモンIDでNOT_FOUNDエラーが発生する", async () => {
    const repository = new PokemonImpl(mockLogger);
    const pokemonId = PokemonId.createRequired(898);

    try {
      await repository.getById({ id: pokemonId });
      expect.unreachable("should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ApplicationStatusError);
      if (error instanceof ApplicationStatusError) {
        expect(error.status).toBe(Status.NOT_FOUND);
      }
    }
  });

  it("APIエラー時にSYSTEM_ERRORが発生する", async () => {
    const repository = new PokemonImpl(mockLogger);
    const pokemonId = PokemonId.createRequired(500);

    try {
      await repository.getById({ id: pokemonId });
      expect.unreachable("should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ApplicationStatusError);
      if (error instanceof ApplicationStatusError) {
        expect(error.status).toBe(Status.SYSTEM_ERROR);
      }
    }
  });

  it("タイムアウト時にSYSTEM_ERRORが発生する", async () => {
    const abortLogger = createMockLogger();
    // @ts-ignore - テスト用にfetchをモック化するため型エラーを無視
    global.fetch = mock(() => {
      return Promise.reject(new DOMException("The operation was aborted", "AbortError"));
    });

    const repository = new PokemonImpl(abortLogger);
    const pokemonId = PokemonId.createRequired(25);

    try {
      await repository.getById({ id: pokemonId });
      expect.unreachable("should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ApplicationStatusError);
      if (error instanceof ApplicationStatusError) {
        expect(error.status).toBe(Status.SYSTEM_ERROR);
        expect(error.domainMessage).toContain("timed out");
      }
    }
  });

  it("不正なレスポンススキーマでSYSTEM_ERRORが発生する", async () => {
    const schemaLogger = createMockLogger();
    // @ts-ignore - テスト用にfetchをモック化するため型エラーを無視
    global.fetch = mock(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: "not-a-number", name: 123 }),
      });
    });

    const repository = new PokemonImpl(schemaLogger);
    const pokemonId = PokemonId.createRequired(25);

    try {
      await repository.getById({ id: pokemonId });
      expect.unreachable("should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ApplicationStatusError);
      if (error instanceof ApplicationStatusError) {
        expect(error.status).toBe(Status.SYSTEM_ERROR);
        expect(error.domainMessage).toContain("Invalid response schema");
      }
    }
  });
});
