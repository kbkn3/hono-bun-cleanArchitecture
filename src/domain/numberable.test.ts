import { describe, expect, it } from "bun:test";
import { ClosedRange, LeftHalfOpenRange, NumberableConverter, OpenRange, RightHalfOpenRange } from "./numberable";
import { ApplicationStatusError } from "./error";

// テスト用のNumberable実装クラス
class TestNumberable {
  constructor(private readonly value: number) {}

  toNumber(): number {
    return this.value;
  }
}

describe("Numberable", () => {
  describe("NumberableConverter", () => {
    it("toNumber - 値が存在する場合は数値に変換する", () => {
      const numberable = new TestNumberable(42);
      expect(NumberableConverter.toNumber(numberable)).toBe(42);
    });

    it("toNumber - 値がundefinedの場合はundefinedを返す", () => {
      expect(NumberableConverter.toNumber(undefined)).toBeUndefined();
    });

    it("toString - 値が存在する場合は文字列に変換する", () => {
      const numberable = new TestNumberable(42);
      expect(NumberableConverter.toString(numberable)).toBe("42");
    });

    it("toString - 値がundefinedの場合はundefinedを返す", () => {
      expect(NumberableConverter.toString(undefined)).toBeUndefined();
    });

    it("toStringFromArray - 値が存在する場合はカンマ区切りの文字列に変換する", async () => {
      const numberables = [new TestNumberable(1), new TestNumberable(2), new TestNumberable(3)];
      expect(await NumberableConverter.toStringFromArray(numberables)).toBe("1,2,3");
    });

    it("toStringFromArray - セパレータを指定できる", async () => {
      const numberables = [new TestNumberable(1), new TestNumberable(2), new TestNumberable(3)];
      expect(await NumberableConverter.toStringFromArray(numberables, "-")).toBe("1-2-3");
    });

    it("toStringFromArray - 値がundefinedの場合はundefinedを返す", async () => {
      expect(await NumberableConverter.toStringFromArray(undefined)).toBeUndefined();
    });

    it("toStringFromArray - 空配列の場合はundefinedを返す", async () => {
      expect(await NumberableConverter.toStringFromArray([])).toBeUndefined();
    });
  });

  describe("Range", () => {
    it("最小値が最大値より大きい場合はエラーが発生する", () => {
      expect(() => {
        new OpenRange(10, 5);
      }).toThrow(ApplicationStatusError);
    });

    describe("OpenRange", () => {
      it("範囲内の値はtrueを返す", () => {
        const range = new OpenRange(1, 10);
        expect(range.isCover(5)).toBe(true);
      });

      it("境界値はfalseを返す", () => {
        const range = new OpenRange(1, 10);
        expect(range.isCover(1)).toBe(false);
        expect(range.isCover(10)).toBe(false);
      });

      it("範囲外の値はfalseを返す", () => {
        const range = new OpenRange(1, 10);
        expect(range.isCover(0)).toBe(false);
        expect(range.isCover(11)).toBe(false);
      });
    });

    describe("RightHalfOpenRange", () => {
      it("範囲内の値はtrueを返す", () => {
        const range = new RightHalfOpenRange(1, 10);
        expect(range.isCover(5)).toBe(true);
      });

      it("左境界値はtrueを返す", () => {
        const range = new RightHalfOpenRange(1, 10);
        expect(range.isCover(1)).toBe(true);
      });

      it("右境界値はfalseを返す", () => {
        const range = new RightHalfOpenRange(1, 10);
        expect(range.isCover(10)).toBe(false);
      });

      it("範囲外の値はfalseを返す", () => {
        const range = new RightHalfOpenRange(1, 10);
        expect(range.isCover(0)).toBe(false);
        expect(range.isCover(11)).toBe(false);
      });
    });

    describe("LeftHalfOpenRange", () => {
      it("範囲内の値はtrueを返す", () => {
        const range = new LeftHalfOpenRange(1, 10);
        expect(range.isCover(5)).toBe(true);
      });

      it("左境界値はfalseを返す", () => {
        const range = new LeftHalfOpenRange(1, 10);
        expect(range.isCover(1)).toBe(false);
      });

      it("右境界値はtrueを返す", () => {
        const range = new LeftHalfOpenRange(1, 10);
        expect(range.isCover(10)).toBe(true);
      });

      it("範囲外の値はfalseを返す", () => {
        const range = new LeftHalfOpenRange(1, 10);
        expect(range.isCover(0)).toBe(false);
        expect(range.isCover(11)).toBe(false);
      });
    });

    describe("ClosedRange", () => {
      it("範囲内の値はtrueを返す", () => {
        const range = new ClosedRange(1, 10);
        expect(range.isCover(5)).toBe(true);
      });

      it("境界値はtrueを返す", () => {
        const range = new ClosedRange(1, 10);
        expect(range.isCover(1)).toBe(true);
        expect(range.isCover(10)).toBe(true);
      });

      it("範囲外の値はfalseを返す", () => {
        const range = new ClosedRange(1, 10);
        expect(range.isCover(0)).toBe(false);
        expect(range.isCover(11)).toBe(false);
      });
    });
  });
});
