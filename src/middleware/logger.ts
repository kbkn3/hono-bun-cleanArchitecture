import { Context, MiddlewareHandler } from "hono";

/**
 * リクエスト・レスポンスの詳細なログを出力するミドルウェア
 */
export const detailedLogger = (): MiddlewareHandler => {
  return async (c: Context, next: () => Promise<void>) => {
    const requestId = generateRequestId();
    const method = c.req.method;
    const url = c.req.url;
    
    // リクエスト開始時のログ
    const startTime = Date.now();
    console.log(`[${requestId}] Request started: ${method} ${url}`);
    
    try {
      // 次のミドルウェアまたはハンドラを実行
      await next();
      
      // レスポンス完了時のログ
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.log(`[${requestId}] Response completed: ${method} ${url} - ${c.res.status} (${responseTime}ms)`);
    } catch (error) {
      // エラー発生時のログ
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      console.error(`[${requestId}] Error occurred: ${method} ${url} (${responseTime}ms)`, error);
      throw error; // エラーを再スロー
    }
  };
};

/**
 * ユニークなリクエストIDを生成
 */
function generateRequestId(): string {
  return `req-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
}
