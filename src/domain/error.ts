export class Status {
  /** 成功（正常系） */
  public static readonly SUCCESS = new Status(1, 'Success');
  /** データが存在しない（正常系） */
  public static readonly NOT_FOUND = new Status(2, 'Not Found');
  /** システム起因のエラー（異常系） */
  public static readonly SYSTEM_ERROR = new Status(3, 'System Error');
  /** 値オブジェクトなどに本来ありえないデータが入ってきた */
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
 * 環境変数など起動時に必要な情報が設定されていない
 */
export class ApplicationConfigurationError extends ApplicationError {
  public constructor(message: string) {
    super(`Configuration Error: ${message}`);
  }
}

/**
 * 上流のシステムなどに異常があり、これ以上処理を継続できない
 */
export class ApplicationStatusError extends ApplicationError {
  public readonly status: Status;
  public readonly domainMessage: string;

  public constructor(message: string, status: Status) {
    super(`Application Status Error status: ${status.toMessage()} message: ${message}`);
    this.status = status;
    this.domainMessage = message;
  }
}
