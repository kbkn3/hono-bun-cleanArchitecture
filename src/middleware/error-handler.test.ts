import { describe, expect, it, mock } from "bun:test";
import { errorHandler, ErrorResponse } from "./error-handler";
import { ApplicationStatusError, Status } from "@/domain/error";
import { StatusCode } from "@/domain/status.code";

describe("errorHandler", () => {
  it("正常なリクエストの場合は次のミドルウェアを実行する", async () => {
    // モックコンテキスト
    const mockContext = {};
    
    // 次のミドルウェアのモック
    const nextMock = mock(async () => {
      // 正常に処理が完了
      return;
    });
    
    // エラーハンドラミドルウェアを実行
    const middleware = errorHandler();
    await middleware(mockContext as any, nextMock);
    
    // 次のミドルウェアが呼ばれたことを確認
    expect(nextMock).toHaveBeenCalled();
  });
  
  it("ApplicationStatusError(NOT_FOUND)の場合は404レスポンスを返す", async () => {
    // モックコンテキスト
    const mockContext = {};
    
    // 次のミドルウェアのモック（エラーをスロー）
    const nextMock = mock(async () => {
      throw new ApplicationStatusError("Resource not found", Status.NOT_FOUND);
    });
    
    // エラーハンドラミドルウェアを実行
    const middleware = errorHandler();
    const result = await middleware(mockContext as any, nextMock) as Response;
    
    // レスポンスを検証
    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(StatusCode.NOT_FOUND);
    
    const responseBody = await result.json() as ErrorResponse;
    expect(responseBody.status).toBe("error");
    expect(responseBody.message).toBe("Resource not found");
  });
  
  it("ApplicationStatusError(ILLEGAL_DATA)の場合は400レスポンスを返す", async () => {
    // モックコンテキスト
    const mockContext = {};
    
    // 次のミドルウェアのモック（エラーをスロー）
    const nextMock = mock(async () => {
      throw new ApplicationStatusError("Invalid data", Status.ILLEGAL_DATA);
    });
    
    // エラーハンドラミドルウェアを実行
    const middleware = errorHandler();
    const result = await middleware(mockContext as any, nextMock) as Response;
    
    // レスポンスを検証
    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(StatusCode.BAD_REQUEST);
    
    const responseBody = await result.json() as ErrorResponse;
    expect(responseBody.status).toBe("error");
    expect(responseBody.message).toBe("Invalid request data");
  });
  
  it("予期しないエラーの場合は500レスポンスを返す", async () => {
    // モックコンテキスト
    const mockContext = {};
    
    // 次のミドルウェアのモック（エラーをスロー）
    const nextMock = mock(async () => {
      throw new Error("Unexpected error");
    });
    
    // エラーハンドラミドルウェアを実行
    const middleware = errorHandler();
    const result = await middleware(mockContext as any, nextMock) as Response;
    
    // レスポンスを検証
    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(StatusCode.INTERNAL_SERVER_ERROR);
    
    const responseBody = await result.json() as ErrorResponse;
    expect(responseBody.status).toBe("error");
    expect(responseBody.message).toBe("Internal server error");
    expect(responseBody.details).toBe("Unexpected error");
  });
});
