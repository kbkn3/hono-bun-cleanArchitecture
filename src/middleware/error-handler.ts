import type { Context, ErrorHandler as HonoErrorHandler } from "hono";
import { ApplicationStatusError, Status } from "@/domain/error";
import { StatusCode } from "@/adapters/http.status.code";
import type { ILogger } from "@/application/logger/logger";

// エラーレスポンスの型定義
export interface ErrorResponse {
  status: string;
  message: string;
  details: string;
}

export interface ErrorHandlerOptions {
  logger: ILogger;
}

/**
 * Honoのapp.onError()に登録するエラーハンドラを生成する
 *
 * Honoのcomposeはハンドラ単位でtry-catchするため、
 * ミドルウェアのtry-catchではルートハンドラの例外を捕捉できない。
 * app.onError()を使うことでHonoのエラーハンドリングと正しく統合する。
 */
export function createErrorHandler(options: ErrorHandlerOptions): HonoErrorHandler {
  const { logger } = options;

  return (error: Error, c: Context) => {
    logError(logger, error);

    if (error instanceof ApplicationStatusError) {
      return handleApplicationError(c, error);
    }
    return handleUnexpectedError(c);
  };
}

function logError(logger: ILogger, error: unknown): void {
  if (error instanceof Error) {
    logger.error("Error caught by error handler", error, {
      errorType: error.constructor.name,
    });
  } else {
    logger.error("Error caught by error handler", undefined, {
      type: typeof error,
      value: String(error),
    });
  }
}

function handleApplicationError(c: Context, error: ApplicationStatusError): Response {
  const mapping = resolveStatus(error.status);

  const responseBody: ErrorResponse = {
    status: "error",
    message: mapping.message,
    details: mapping.httpCode >= 500 ? "Internal server error" : mapping.details,
  };

  return c.json(responseBody, mapping.httpCode as any);
}

interface StatusMapping {
  httpCode: number;
  message: string;
  details: string;
}

const STATUS_FALLBACK: StatusMapping = {
  httpCode: StatusCode.INTERNAL_SERVER_ERROR,
  message: "Internal server error",
  details: "Internal server error",
};

const STATUS_MAP = new Map<Status, StatusMapping>([
  [Status.NOT_FOUND, {
    httpCode: StatusCode.NOT_FOUND,
    message: "Resource not found",
    details: "The requested resource was not found",
  }],
  [Status.ILLEGAL_DATA, {
    httpCode: StatusCode.BAD_REQUEST,
    message: "Invalid request data",
    details: "The request contains invalid data",
  }],
  [Status.SYSTEM_ERROR, STATUS_FALLBACK],
]);

function resolveStatus(status: Status): StatusMapping {
  return STATUS_MAP.get(status) ?? STATUS_FALLBACK;
}

function handleUnexpectedError(c: Context): Response {
  const responseBody: ErrorResponse = {
    status: "error",
    message: "Internal server error",
    details: "An unexpected error occurred",
  };

  return c.json(responseBody, StatusCode.INTERNAL_SERVER_ERROR as any);
}
