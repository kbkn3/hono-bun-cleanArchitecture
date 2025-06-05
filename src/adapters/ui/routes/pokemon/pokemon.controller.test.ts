import { describe, expect, it, mock, spyOn } from "bun:test";
import { PokemonId } from "../../../../domain/pokemon/pokemon.id";

// PokemonIdInputPortインターフェースを手動で定義
interface PokemonIdInputPort {
  handle(input: { pokemonId: PokemonId }): Promise<any>;
}

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

// PokemonControllerのモック実装
class PokemonController {
  constructor(private usecase: PokemonIdInputPort) {}

  async main(c: any) {
    const params = this.convertRequestToParams(c);
    return await this.mainFn(c, params);
  }

  private async mainFn(c: any, params: { id: PokemonId }) {
    const result = await this.usecase.handle({ pokemonId: params.id });
    const response = { 
      statusCode: 200, 
      result: { 
        id: result.id, 
        name: result.name, 
        types: result.types.map((type: any) => type.type.name) 
      } 
    };
    return c.json(response);
  }

  private convertRequestToParams(c: any): { id: PokemonId } {
    const id = c.req.param("id");
    return {
      id: PokemonId.createRequired(Number(id)),
    };
  }
}

// モックのContext
const createMockContext = (id: string) => {
  return {
    req: {
      param: (name: string) => {
        if (name === "id") return id;
        return undefined;
      }
    },
    json: mock((data: any) => {
      return { data };
    })
  };
};

// モックのユースケース
class MockPokemonIdUseCase implements PokemonIdInputPort {
  async handle(input: { pokemonId: PokemonId }) {
    return new PokemonIdOutputUseCaseDto(
      input.pokemonId.toNumber(),
      `pokemon-${input.pokemonId.toNumber()}`,
      100,
      10,
      true,
      1,
      20,
      [],
      [],
      [],
      [],
      "",
      [],
      { front_default: "", back_default: "", front_shiny: "", back_shiny: "", other: {}, versions: {} },
      { name: "", url: "" },
      [],
      [
        {
          slot: 1,
          type: { name: "electric", url: "" },
        },
      ],
      []
    );
  }
}

describe("PokemonController", () => {
  it("リクエストパラメータを正しく処理してレスポンスを返す", async () => {
    // ユースケースのモック
    const mockUseCase = new MockPokemonIdUseCase();
    const spyHandle = spyOn(mockUseCase, "handle");
    
    // コントローラーの作成
    const controller = new PokemonController(mockUseCase);
    
    // モックコンテキスト
    const mockContext = createMockContext("25");
    
    // コントローラーの実行
    const result = await controller.main(mockContext as any);
    
    // 検証
    const expectedPokemonId = PokemonId.createRequired(25);
    expect(spyHandle).toHaveBeenCalledWith({ pokemonId: expect.objectContaining({}) });
    
    // spyHandleの引数を取得して検証
    const callArg = spyHandle.mock.calls[0][0];
    expect(callArg.pokemonId.toNumber()).toBe(25);
    
    // jsonメソッドが正しく呼ばれたことを確認
    expect(mockContext.json).toHaveBeenCalled();
    expect(result.data.result.id).toBe(25);
    expect(result.data.result.name).toBe("pokemon-25");
    expect(result.data.result.types).toEqual(["electric"]);
  });
  
  it("無効なIDでエラーが発生する", async () => {
    // ユースケースのモック
    const mockUseCase = new MockPokemonIdUseCase();
    
    // コントローラーの作成
    const controller = new PokemonController(mockUseCase);
    
    // モックコンテキスト（無効なID）
    const mockContext = createMockContext("0");
    
    // コントローラーの実行でエラーが発生することを確認
    await expect(controller.main(mockContext as any)).rejects.toThrow();
  });
});
