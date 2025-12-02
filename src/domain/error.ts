export class Status {
  /** 成功（正常系） / Success (Without issues) */
  public static readonly SUCCESS = new Status(1, 'Success');
  /** データが存在しない（正常系） / Data not found (Without issues) */
  public static readonly NOT_FOUND = new Status(2, 'Not Found');
  /** BFF起因のエラー（異常系） / Error caused by BFF (Exception) */
  public static readonly BFF_SYSTEM_ERROR = new Status(3, 'BFF System Error');
  /** 値オブジェクトなどに本来ありえないデータが入ってきた / Data that should not be in the value object, etc. has been entered.*/
  public static readonly ILLEGAL_DATA = new Status(4, 'Illegal Data');
  private constructor(private readonly code: number, private readonly message: string) {}

  /**
   * メッセージに変換します / Converts to a message
   */
  toMessage(): string {
    return this.message;
  }
}

export abstract class ApplicationError extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // スタックトレースを適切にキャプチャ（エラー発生箇所を正確に記録）
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * 環境変数など起動時に必要な情報が設定されていない / The information required at startup, such as environment variables, is not set.
 */
export class ApplicationConfigurationError extends ApplicationError {
  public constructor(message: string) {
    super(`BFF Configuration Error: ${message}`);
  }
}

/**
 * 上流のシステムなどに異常があり、これ以上処理を継続できない / An abnormality exists in the upstream system, etc., and the process cannot be continued.
 */
export class ApplicationStatusError extends ApplicationError {
  public readonly status: Status;

  public constructor(message: string, status: Status) {
    super(`BFF Application Status Error status: ${status.toMessage()} message: ${message}`);
    this.status = status;
  }
}
