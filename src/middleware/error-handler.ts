import { Context, MiddlewareHandler } from "hono";
import { ApplicationStatusError, Status } from "@/domain/error";
import { StatusCode } from "@/domain/status.code";

// エラーレスポンスの型定義
export interface ErrorResponse {
  status: string;
  message: string;
  details: string;
}

/**
 * エラーハンドリングミドルウェア
 * アプリケーション内で発生した例外を適切なHTTPレスポンスに変換する
 */
export const errorHandler = (): MiddlewareHandler => {
  return async (c: Context, next: () => Promise<void>) => {
    try {
      await next();
    } catch (error) {
      // スタックトレースを明示的に出力
      logError(error);

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
function logError(error: unknown): void {
  if (error instanceof Error) {
    console.error("Error caught by middleware:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  } else {
    console.error("Error caught by middleware:", {
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
