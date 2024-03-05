import { ApplicationStatusError, Status } from '@/domain/error';

export interface Numberable {
  /**
   * Numberに変換します
   */
  toNumber(): number;
}

/**
 * Numberable を実装したクラスの変換処理
 */
export class NumberableConverter {
  static toNumber(value: Numberable | undefined) {
    if (value) {
      return value.toNumber();
    }

    return undefined;
  }

  static toString(value: Numberable | undefined) {
    const num = this.toNumber(value);
    if (num == null) return undefined;

    return num.toString();
  }

  static async toStringFromArray(
    values: (Numberable | undefined)[] | undefined,
    sep = ',',
  ): Promise<string | undefined> {
    if (values && values.length > 0) {
      const rows = await Promise.all(values.map((v) => this.toNumber(v)));

      return rows.join(sep);
    }

    return undefined;
  }
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

/**
 * Numberをフォーマットする引数
 */
export interface NumberFormatArgs {
  /**
   * 10のN乗してvalueを割る
   */
  pow?: number;
  /**
   * 小数部に使用する最大桁数
   */
  maximumFractionDigits?: number;
  /**
   * 小数部に使用する最小桁数
   */
  minimumFractionDigits?: number;
  /**
   * maxDecimal よりも小数部がある場合、
   *   true:  動的に表示桁数を増やす
   *   false: maxDecimalに従った表示桁数に固定する
   */
  isDynamicIncreasedDigit?: boolean;
  /**
   * 単位 末尾に文字列を付与します
   */
  unit?: string;
  /**
   * 入力値の小数点を切り捨てるかどうか
   */
  isFloorRawValue?: boolean;
}

/**
 * Numberをフォーマットします
 */
export class NumberFormat {
  /**
   * 10のN乗してvalueを割る
   */
  private readonly pow: number;
  /**
   * 小数部に使用する最大桁数
   */
  private readonly maximumFractionDigits?: number;
  /**
   * 小数部に使用する最小桁数
   */
  private readonly minimumFractionDigits: number;
  /**
   * 単位 末尾に文字列を付与します
   */
  private readonly unit: string;

  /**
   * 入力値の小数点を切り捨てるかどうか
   */
  private readonly isFloorRawValue: boolean;

  /**
   * maximumFractionDigits よりも小数部がある場合、
   *   true:  動的に表示桁数を増やす
   *   false: maxDecimalに従った表示桁数に固定する
   */
  private readonly isDynamicIncreasedDigit: boolean;

  /**
   * @param args - 引数
   */
  public constructor(args?: NumberFormatArgs) {
    this.pow = args?.pow ?? 0;
    this.maximumFractionDigits = args?.maximumFractionDigits;
    this.minimumFractionDigits = args?.minimumFractionDigits ?? 0;
    this.isDynamicIncreasedDigit = args?.isDynamicIncreasedDigit ?? true;
    this.unit = args?.unit ?? '';
    this.isFloorRawValue = args?.isFloorRawValue ?? false;
  }

  /**
   * フォーマットします
   * @param value - 数値
   */
  format(value: number): string {
    let rawValue = value;
    if (this.isFloorRawValue) {
      rawValue = Math.floor(rawValue);
    }
    const divided = rawValue / Math.pow(10, this.pow);
    // 小数部の長さを計算しておく
    const fractionDigits = this.getFractionDigits(divided);
    let maximumFractionDigits = this.maximumFractionDigits;
    const minimumFractionDigits = this.minimumFractionDigits;

    // 小数部が存在するとき
    if (fractionDigits > 0) {
      // 小数部に使用する最大桁数が指定されていない場合、小数部を全て表示する
      if (maximumFractionDigits === undefined) {
        maximumFractionDigits = fractionDigits;
        // 小数部に使用する最大桁数より、扱う数字の小数部の桁数が大きい、かつ、boolが指定されている場合も、全て表示する
      } else if (this.isDynamicIncreasedDigit && fractionDigits > maximumFractionDigits) {
        maximumFractionDigits = fractionDigits;
      }
    }
    const initFormat = {
      maximumFractionDigits: maximumFractionDigits,
      minimumFractionDigits: minimumFractionDigits,
    };
    const formatted = new Intl.NumberFormat('ja', initFormat).format(divided);

    return `${formatted}${this.unit}`;
  }

  /**
   * 小数部のながさを返す
   * @param value - 数値
   */
  private getFractionDigits(value: number) {
    const numericStrings = String(value).split('.');
    if (numericStrings.length >= 2) {
      return numericStrings[1].length;
    }

    return 0;
  }
}
