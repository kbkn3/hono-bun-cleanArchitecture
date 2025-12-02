import type { ILogger } from "@/application/logger/logger";

/**
 * コンソールベースのロガー実装
 * 開発環境やシンプルなデプロイメント向け
 */
export class ConsoleLogger implements ILogger {
  info(message: string, context?: Record<string, unknown>): void {
    console.log(this.formatMessage("INFO", message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(this.formatMessage("WARN", message, context));
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    const errorContext = error
      ? {
          ...context,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
        }
      : context;

    console.error(this.formatMessage("ERROR", message, errorContext));
  }

  debug(message: string, context?: Record<string, unknown>): void {
    console.debug(this.formatMessage("DEBUG", message, context));
  }

  private formatMessage(
    level: string,
    message: string,
    context?: Record<string, unknown>
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${level}] ${message}${contextStr}`;
  }
}
