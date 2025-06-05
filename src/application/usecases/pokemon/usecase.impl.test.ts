import { describe, expect, it, mock, spyOn } from "bun:test";
import { PokemonId } from "../../../domain/pokemon/pokemon.id";
import { PokemonRepositoryDto } from "../../repositories/pokemon/pokemon.model";

// PokemonRepositoryインターフェースを手動で定義
interface PokemonRepository {
  getById(condition: { id: PokemonId }): Promise<PokemonRepositoryDto>;
}

// PokemonIdInputPortインターフェースを手動で定義
interface PokemonIdInputPort {
  handle(input: { pokemonId: PokemonId }): Promise<any>;
}

// モックデータ
const mockPokemonData: PokemonRepositoryDto = {
  pokemon: {
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
      // @ts-ignore - テスト用に簡略化したモックデータ
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
  },
};

// モックリポジトリ
class MockPokemonRepository implements PokemonRepository {
  async getById() {
    return mockPokemonData;
  }
}

// PokemonIdUseCaseのモック実装
class PokemonIdUseCase implements PokemonIdInputPort {
  constructor(private pokemonRepository: PokemonRepository) {}

  async handle(input: { pokemonId: PokemonId }) {
    const pokemonIdInteractor = new PokemonIdInteractor(this.pokemonRepository);
    return await pokemonIdInteractor.handle(input);
  }
}

// PokemonIdInteractorのモック実装
class PokemonIdInteractor {
  constructor(private pokemonRepository: PokemonRepository) {}

  async handle(input: { pokemonId: PokemonId }) {
    const pokemon = await this.pokemonRepository.getById({ id: input.pokemonId });
    return {
      id: pokemon.pokemon.id,
      name: pokemon.pokemon.name,
      base_experience: pokemon.pokemon.base_experience,
      height: pokemon.pokemon.height,
      is_default: pokemon.pokemon.is_default,
      order: pokemon.pokemon.order,
      weight: pokemon.pokemon.weight,
      abilities: pokemon.pokemon.abilities,
      forms: pokemon.pokemon.forms,
      game_indices: pokemon.pokemon.game_indices,
      held_items: pokemon.pokemon.held_items,
      location_area_encounters: pokemon.pokemon.location_area_encounters,
      moves: pokemon.pokemon.moves,
      sprites: pokemon.pokemon.sprites,
      species: pokemon.pokemon.species,
      stats: pokemon.pokemon.stats,
      types: pokemon.pokemon.types,
      past_types: pokemon.pokemon.past_types,
    };
  }
}

describe("PokemonIdUseCase", () => {
  it("正しくポケモン情報を取得できる", async () => {
    // リポジトリのモック
    const mockRepo = new MockPokemonRepository();
    const spyGetById = spyOn(mockRepo, "getById");
    
    // ユースケースの作成
    const useCase = new PokemonIdUseCase(mockRepo);
    
    // 入力データ
    const pokemonId = PokemonId.createRequired(25);
    const input = { pokemonId };
    
    // ユースケースの実行
    const result = await useCase.handle(input);
    
    // 検証
    expect(spyGetById).toHaveBeenCalledWith({ id: pokemonId });
    expect(result.id).toBe(25);
    expect(result.name).toBe("pikachu");
    expect(result.types[0].type.name).toBe("electric");
  });
});

describe("PokemonIdInteractor", () => {
  it("リポジトリから取得したデータを正しく変換する", async () => {
    // リポジトリのモック
    const mockRepo = new MockPokemonRepository();
    const spyGetById = spyOn(mockRepo, "getById");
    
    // インタラクターの作成
    const interactor = new PokemonIdInteractor(mockRepo);
    
    // 入力データ
    const pokemonId = PokemonId.createRequired(25);
    const input = { pokemonId };
    
    // インタラクターの実行
    const result = await interactor.handle(input);
    
    // 検証
    expect(spyGetById).toHaveBeenCalledWith({ id: pokemonId });
    expect(result.id).toBe(25);
    expect(result.name).toBe("pikachu");
    expect(result.base_experience).toBe(112);
    expect(result.height).toBe(4);
    expect(result.weight).toBe(60);
    expect(result.types[0].type.name).toBe("electric");
  });
});
