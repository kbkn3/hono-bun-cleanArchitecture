import { describe, expect, it } from "bun:test";
import { PokemonId } from "./pokemon.id";
import { ApplicationStatusError, Status } from "../error";

describe("PokemonId", () => {
  describe("createRequired", () => {
    it("有効な図鑑番号でPokemonIdを作成できる", () => {
      // 境界値テスト: 最小値
      const minId = PokemonId.createRequired(1);
      expect(minId.toNumber()).toBe(1);

      // 通常値
      const normalId = PokemonId.createRequired(25); // ピカチュウ
      expect(normalId.toNumber()).toBe(25);

      // 境界値テスト: 最大値
      const maxId = PokemonId.createRequired(898);
      expect(maxId.toNumber()).toBe(898);
    });

    it("範囲外の図鑑番号でエラーが発生する", () => {
      // 境界値テスト: 最小値未満
      expect(() => {
        PokemonId.createRequired(0);
      }).toThrow(ApplicationStatusError);

      // 境界値テスト: 最大値超過
      expect(() => {
        PokemonId.createRequired(899);
      }).toThrow(ApplicationStatusError);
    });
  });

  describe("toNumber", () => {
    it("数値に変換できる", () => {
      const id = PokemonId.createRequired(25);
      expect(id.toNumber()).toBe(25);
    });
  });
});
