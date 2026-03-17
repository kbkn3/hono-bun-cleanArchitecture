import { describe, expect, it } from "bun:test";
import { PokemonPresenter } from "./presenter";
import { PokemonIdOutputUseCaseDto } from "@/application/usecases/pokemon/usecase";

describe("PokemonPresenter", () => {
  it("ユースケースの出力を正しくプレゼンテーション層のDTOに変換する", () => {
    const useCaseOutput = new PokemonIdOutputUseCaseDto({
      id: 25,
      name: "pikachu",
      baseExperience: 112,
      height: 4,
      weight: 60,
      types: ["electric"],
      abilities: ["static"],
      spriteUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    });

    const presenter = new PokemonPresenter();
    const result = presenter.handle(useCaseOutput);

    expect(result.result.id).toBe(25);
    expect(result.result.name).toBe("pikachu");
    expect(result.result.types).toEqual(["electric"]);
  });
});
