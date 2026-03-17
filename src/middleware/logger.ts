import type { Context, MiddlewareHandler } from "hono";
import type { ILogger } from "@/application/logger/logger";

export interface DetailedLoggerOptions {
  logger: ILogger;
}

/**
 * リクエスト・レスポンスの詳細なログを出力するミドルウェア
 */
export const detailedLogger = (options: DetailedLoggerOptions): MiddlewareHandler => {
  const { logger } = options;

  return async (c: Context, next: () => Promise<void>) => {
    const requestId = generateRequestId();
    const method = c.req.method;
    const logPath = c.req.path;

    const startTime = Date.now();
    logger.info(`[${requestId}] Request started: ${method} ${logPath}`);

    try {
      // 次のミドルウェアまたはハンドラを実行
      await next();

      const responseTime = Date.now() - startTime;
      logger.info(`[${requestId}] Response completed: ${method} ${logPath} - ${c.res.status} (${responseTime}ms)`);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error(
        `[${requestId}] Error occurred: ${method} ${logPath} (${responseTime}ms)`,
        error instanceof Error ? error : undefined,
      );
      throw error;
    }
  };
};

function generateRequestId(): string {
  return crypto.randomUUID();
}
