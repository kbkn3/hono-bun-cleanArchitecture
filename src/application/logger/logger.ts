/**
 * ロガーインターフェース
 * Application Layerで定義し、Infrastructure/Adapters Layerで実装する
 */
export interface ILogger {
  /**
   * 情報レベルのログを出力
   */
  info(message: string, context?: Record<string, unknown>): void;

  /**
   * 警告レベルのログを出力
   */
  warn(message: string, context?: Record<string, unknown>): void;

  /**
   * エラーレベルのログを出力
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void;

  /**
   * デバッグレベルのログを出力
   */
  debug(message: string, context?: Record<string, unknown>): void;
}
