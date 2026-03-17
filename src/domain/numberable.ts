import { ApplicationStatusError, Status } from '@/domain/error';

export interface Numberable {
  /**
   * Numberに変換します
   */
  toNumber(): number;
}

/**
 * レンジ
 */
export abstract class Range {
  /**
   * @param min - 最小
   * @param max - 最大
   */
  public constructor(protected readonly min: number, protected readonly max: number) {
    if (min > max) {
      throw new ApplicationStatusError('Maximum is less than minimum', Status.ILLEGAL_DATA);
    }
  }

  /**
   * 範囲に含まれているか？
   * @param value - 値
   */
  abstract isCover(value: number): boolean;
}
/**
 * レンジ(開区間)
 */
export class OpenRange extends Range {
  /**
   * 範囲に含まれているか？
   * @param value - 値
   */
  isCover(value: number): boolean {
    return this.min < value && value < this.max;
  }
}
/**
 * レンジ(右半開区間)
 */
export class RightHalfOpenRange extends Range {
  /**
   * 範囲に含まれているか？
   * @param value - 値
   */
  isCover(value: number): boolean {
    return this.min <= value && value < this.max;
  }
}
/**
 * レンジ(左半開区間)
 */
export class LeftHalfOpenRange extends Range {
  /**
   * 範囲に含まれているか？
   * @param value - 値
   */
  isCover(value: number): boolean {
    return this.min < value && value <= this.max;
  }
}
/**
 * レンジ(閉区間)
 */
export class ClosedRange extends Range {
  /**
   * 範囲に含まれているか？
   * @param value - 値
   */
  isCover(value: number): boolean {
    return this.min <= value && value <= this.max;
  }
}

