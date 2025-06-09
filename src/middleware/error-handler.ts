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
      console.error("Error caught by middleware:", error);
      
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
 * アプリケーション固有のエラーを処理する
 */
function handleApplicationError(c: Context, error: ApplicationStatusError): Response {
  // エラーの種類に応じてステータスコードを決定
  let statusCode = StatusCode.INTERNAL_SERVER_ERROR;
  let errorMessage = "Internal server error";
  
  if (error.message.includes(Status.NOT_FOUND.toMessage())) {
    statusCode = StatusCode.NOT_FOUND;
    errorMessage = "Resource not found";
  } else if (error.message.includes(Status.ILLEGAL_DATA.toMessage())) {
    statusCode = StatusCode.BAD_REQUEST;
    errorMessage = "Invalid request data";
  }
  
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
