import { describe, expect, it, spyOn } from "bun:test";
import { PokemonId } from "../../../domain/pokemon/pokemon.id";
import type { PokemonRepositoryDto } from "../../repositories/pokemon/pokemon.model";
import type { PokemonRepository } from "../../repositories/pokemon/pokemon";
import { PokemonIdUseCase } from "./usecase.impl";

// モックデータ
const mockPokemonData: PokemonRepositoryDto = {
  pokemon: {
    id: 25,
    name: "pikachu",
    baseExperience: 112,
    height: 4,
    weight: 60,
    types: ["electric"],
    abilities: ["static"],
    spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  },
};

// モックリポジトリ
class MockPokemonRepository implements PokemonRepository {
  async getById() {
    return mockPokemonData;
  }
}

describe("PokemonIdUseCase", () => {
  it("正しくポケモン情報を取得し、ビジネスロジックに基づいた出力DTOを返す", async () => {
    // リポジトリのモック
    const mockRepo = new MockPokemonRepository();
    const spyGetById = spyOn(mockRepo, "getById");

    // 本番のPokemonIdUseCaseをインスタンス化
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
    expect(result.baseExperience).toBe(112);
    expect(result.height).toBe(4);
    expect(result.weight).toBe(60);
    expect(result.types).toEqual(["electric"]);
    expect(result.abilities).toEqual(["static"]);
    expect(result.spriteUrl).toBe("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png");
  });
});
