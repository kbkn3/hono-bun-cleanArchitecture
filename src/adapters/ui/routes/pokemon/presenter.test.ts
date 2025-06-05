import { describe, expect, it } from "bun:test";
import { PokemonPresenter } from "./presenter";
import { StatusCode } from "../../../../domain/status.code";

// PokemonIdOutputUseCaseDtoクラスを手動で定義
class PokemonIdOutputUseCaseDto {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly base_experience: number,
    readonly height: number,
    readonly is_default: boolean,
    readonly order: number,
    readonly weight: number,
    readonly abilities: any[],
    readonly forms: any[],
    readonly game_indices: any[],
    readonly held_items: any[],
    readonly location_area_encounters: string,
    readonly moves: any[],
    readonly sprites: any,
    readonly species: any,
    readonly stats: any[],
    readonly types: any[],
    readonly past_types: any[]
  ) {}
}

describe("PokemonPresenter", () => {
  it("ユースケースの出力を正しくプレゼンテーション層のDTOに変換する", () => {
    // ユースケース出力DTOのモック
    const useCaseOutput = new PokemonIdOutputUseCaseDto(
      25, // id
      "pikachu", // name
      112, // base_experience
      4, // height
      true, // is_default
      35, // order
      60, // weight
      [], // abilities
      [], // forms
      [], // game_indices
      [], // held_items
      "https://pokeapi.co/api/v2/pokemon/25/encounters", // location_area_encounters
      [], // moves
      {
        front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        back_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png",
        front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png",
        back_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/25.png",
        other: {},
        versions: {},
      }, // sprites
      { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon-species/25/" }, // species
      [], // stats
      [
        {
          slot: 1,
          type: { name: "electric", url: "https://pokeapi.co/api/v2/type/13/" },
        },
      ], // types
      [] // past_types
    );
    
    // プレゼンターの実行
    const presenter = new PokemonPresenter();
    const result = presenter.handle(useCaseOutput);
    
    // 検証
    expect(result.statusCode).toBe(StatusCode.OK);
    expect(result.result.id).toBe(25);
    expect(result.result.name).toBe("pikachu");
    expect(result.result.types).toEqual(["electric"]);
  });
});
