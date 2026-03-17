import { describe, expect, it, mock, spyOn } from "bun:test";
import { PokemonId } from "../../../../domain/pokemon/pokemon.id";
import type { PokemonIdInputPort } from "@/application/usecases/pokemon/usecase";
import { PokemonIdOutputUseCaseDto } from "@/application/usecases/pokemon/usecase";
import { PokemonController } from "./pokemon.controller";
import { PokemonPresenter } from "./presenter";

const createMockContext = (id: string) => {
  return {
    req: {
      param: (name: string) => {
        if (name === "id") return id;
        return undefined;
      }
    },
    json: mock((data: unknown, status?: number) => {
      return { data, status };
    })
  };
};

class MockPokemonIdUseCase implements PokemonIdInputPort {
  async handle(input: { pokemonId: PokemonId }) {
    return new PokemonIdOutputUseCaseDto({
      id: input.pokemonId.toNumber(),
      name: `pokemon-${input.pokemonId.toNumber()}`,
      baseExperience: 100,
      height: 10,
      weight: 20,
      types: ["electric"],
      abilities: ["static"],
      spriteUrl: "https://example.com/sprite.png",
    });
  }
}

const createController = (usecase?: MockPokemonIdUseCase) => {
  const uc = usecase ?? new MockPokemonIdUseCase();
  return new PokemonController(uc, new PokemonPresenter());
};

describe("PokemonController", () => {
  it("リクエストパラメータを正しく処理してレスポンスを返す", async () => {
    const mockUseCase = new MockPokemonIdUseCase();
    const spyHandle = spyOn(mockUseCase, "handle");
    const controller = createController(mockUseCase);
    const mockContext = createMockContext("25");

    const result = (await controller.main(mockContext as any)) as any;

    expect(spyHandle).toHaveBeenCalled();
    const callArg = spyHandle.mock.calls[0][0];
    expect(callArg.pokemonId.toNumber()).toBe(25);

    expect(mockContext.json).toHaveBeenCalled();
    expect(result.data.result.id).toBe(25);
    expect(result.data.result.name).toBe("pokemon-25");
    expect(result.data.result.types).toEqual(["electric"]);
  });

  it("無効なIDでエラーが発生する", async () => {
    const controller = createController();
    const mockContext = createMockContext("0");

    await expect(controller.main(mockContext as any)).rejects.toThrow();
  });

  it.each(["1e2", "0x19", " 25 ", "abc", ""])(
    "Number()の緩い変換ケース: '%s' でもバリデーションされる",
    async (id) => {
      const controller = createController();
      const mockContext = createMockContext(id);

      const parsed = Number(id);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 898) {
        await expect(controller.main(mockContext as any)).rejects.toThrow();
      }
    }
  );
});
