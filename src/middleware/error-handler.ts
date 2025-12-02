import type { Context, MiddlewareHandler } from "hono";
import { ApplicationStatusError, Status } from "@/domain/error";
import { StatusCode } from "@/domain/status.code";
import type { ILogger } from "@/application/logger/logger";

// エラーレスポンスの型定義
export interface ErrorResponse {
  status: string;
  message: string;
  details: string;
}

/**
 * エラーハンドリングミドルウェアのオプション
 */
export interface ErrorHandlerOptions {
  logger: ILogger;
}

/**
 * エラーハンドリングミドルウェア
 * アプリケーション内で発生した例外を適切なHTTPレスポンスに変換する
 * @param options - ミドルウェアオプション（loggerを含む）
 */
export const errorHandler = (options: ErrorHandlerOptions): MiddlewareHandler => {
  const { logger } = options;

  return async (c: Context, next: () => Promise<void>) => {
    try {
      await next();
    } catch (error) {
      // ILoggerを使用してエラーをログ出力
      logError(logger, error);

      if (error instanceof ApplicationStatusError) {
        // アプリケーション固有のエラー処理
        return handleApplicationError(c, error);
      } else {
        // 未処理の例外
        return handleUnexpectedError(c, error);
      }
    }
  };
};

/**
 * エラーをスタックトレース付きでログ出力する
 */
function logError(logger: ILogger, error: unknown): void {
  if (error instanceof Error) {
    logger.error("Error caught by middleware", error, {
      errorType: error.constructor.name,
    });
  } else {
    logger.error("Error caught by middleware", undefined, {
      type: typeof error,
      value: String(error),
    });
  }
}

/**
 * アプリケーション固有のエラーを処理する
 */
function handleApplicationError(c: Context, error: ApplicationStatusError): Response {
  // statusプロパティを使用してステータスコードを決定
  const statusCode = mapStatusToHttpCode(error.status);
  const errorMessage = mapStatusToMessage(error.status);

  const responseBody: ErrorResponse = {
    status: "error",
    message: errorMessage,
    details: error.message
  };

  return new Response(
    JSON.stringify(responseBody),
    {
      status: statusCode,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}

/**
 * ドメインStatusをHTTPステータスコードにマッピング
 */
function mapStatusToHttpCode(status: Status): number {
  switch (status) {
    case Status.NOT_FOUND:
      return StatusCode.NOT_FOUND;
    case Status.ILLEGAL_DATA:
      return StatusCode.BAD_REQUEST;
    case Status.BFF_SYSTEM_ERROR:
    default:
      return StatusCode.INTERNAL_SERVER_ERROR;
  }
}

/**
 * ドメインStatusをエラーメッセージにマッピング
 */
function mapStatusToMessage(status: Status): string {
  switch (status) {
    case Status.NOT_FOUND:
      return "Resource not found";
    case Status.ILLEGAL_DATA:
      return "Invalid request data";
    case Status.BFF_SYSTEM_ERROR:
    default:
      return "Internal server error";
  }
}

/**
 * 予期しないエラーを処理する
 */
function handleUnexpectedError(c: Context, error: unknown): Response {
  const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
  
  const responseBody: ErrorResponse = {
    status: "error",
    message: "Internal server error",
    details: errorMessage
  };
  
  return new Response(
    JSON.stringify(responseBody),
    {
      status: StatusCode.INTERNAL_SERVER_ERROR,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
