import { describe, expect, it, mock } from "bun:test";
import { HelloWorldController } from "./hello.world.controller";

describe("HelloWorldController", () => {
  it("メッセージを正しく返す", async () => {
    // モックコンテキスト
    const mockContext = {
      req: {
        param: (name: string) => {
          if (name === "message") return "TestMessage";
          return undefined;
        }
      },
      json: mock((data: any) => {
        return { _data: data };
      })
    };
    
    // コントローラーの作成
    const controller = new HelloWorldController();
    
    // コントローラーの実行
    const result = await controller.main(mockContext as any);
    
    // 検証
    expect(mockContext.json).toHaveBeenCalled();
    expect(result._data).toEqual({ message: "TestMessage" });
  });
});
