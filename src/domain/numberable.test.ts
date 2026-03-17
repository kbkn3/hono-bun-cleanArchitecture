import { describe, expect, it } from "bun:test";
import { ClosedRange, LeftHalfOpenRange, OpenRange, RightHalfOpenRange } from "./numberable";
import { ApplicationStatusError } from "./error";

describe("Numberable", () => {
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
