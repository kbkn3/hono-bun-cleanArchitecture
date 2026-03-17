import { describe, expect, it, mock } from "bun:test";
import { Hono } from "hono";
import { createErrorHandler } from "./error-handler";
import { ApplicationStatusError, Status } from "@/domain/error";
import { StatusCode } from "@/adapters/http.status.code";
import type { ILogger } from "@/application/logger/logger";

function createMockLogger(): ILogger {
  return {
    info: mock(() => {}),
    warn: mock(() => {}),
    error: mock(() => {}),
    debug: mock(() => {}),
  };
}

describe("createErrorHandler", () => {
  it("正常なリクエストの場合はエラーハンドラを通らない", async () => {
    const mockLogger = createMockLogger();
    const app = new Hono()
      .onError(createErrorHandler({ logger: mockLogger }))
      .get("/test", (c) => c.json({ ok: true }));

    const res = await app.request("/test");
    expect(res.status).toBe(200);
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it("ApplicationStatusError(NOT_FOUND)の場合は404レスポンスを返す", async () => {
    const mockLogger = createMockLogger();
    const app = new Hono()
      .onError(createErrorHandler({ logger: mockLogger }))
      .get("/test", () => {
        throw new ApplicationStatusError("Resource not found", Status.NOT_FOUND);
      });

    const res = await app.request("/test");
    expect(res.status).toBe(StatusCode.NOT_FOUND);

    const body = await res.json() as any;
    expect(body.status).toBe("error");
    expect(body.message).toBe("Resource not found");
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it("ApplicationStatusError(ILLEGAL_DATA)の場合は400レスポンスを返す", async () => {
    const mockLogger = createMockLogger();
    const app = new Hono()
      .onError(createErrorHandler({ logger: mockLogger }))
      .get("/test", () => {
        throw new ApplicationStatusError("Invalid data", Status.ILLEGAL_DATA);
      });

    const res = await app.request("/test");
    expect(res.status).toBe(StatusCode.BAD_REQUEST);

    const body = await res.json() as any;
    expect(body.status).toBe("error");
    expect(body.message).toBe("Invalid request data");
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it("予期しないエラーの場合は500レスポンスを返す", async () => {
    const mockLogger = createMockLogger();
    const app = new Hono()
      .onError(createErrorHandler({ logger: mockLogger }))
      .get("/test", () => {
        throw new Error("Unexpected error");
      });

    const res = await app.request("/test");
    expect(res.status).toBe(StatusCode.INTERNAL_SERVER_ERROR);

    const body = await res.json() as any;
    expect(body.status).toBe("error");
    expect(body.message).toBe("Internal server error");
    expect(body.details).toBe("An unexpected error occurred");
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it("logger.errorがスタックトレース付きで呼ばれる", async () => {
    const mockLogger = createMockLogger();
    const testError = new ApplicationStatusError("Test error", Status.SYSTEM_ERROR);
    const app = new Hono()
      .onError(createErrorHandler({ logger: mockLogger }))
      .get("/test", () => {
        throw testError;
      });

    await app.request("/test");

    expect(mockLogger.error).toHaveBeenCalledWith(
      "Error caught by error handler",
      testError,
      { errorType: "ApplicationStatusError" }
    );
  });
});
