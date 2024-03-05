import { ApplicationStatusError, Status } from "@/domain/error";
import { ClosedRange, Numberable } from "@/domain/numberable";


export class PokemonId implements Numberable {
  public static readonly RANGE = new ClosedRange(1, 898);

  /**
   * @param value 図鑑番号
   */
  private constructor(private readonly value: number) {}

  /**
   * @param value 図鑑番号
   */
  static createRequired(value: number): PokemonId {
    if (!PokemonId.RANGE.isCover(value)) {
      throw new ApplicationStatusError(`Invalid PokemonId: ${value}`, Status.ILLEGAL_DATA);
    }
    return new PokemonId(value);
  }

  /**
   * @param value 図鑑番号
   */
  toNumber(): number {
    return this.value;
  }
}
