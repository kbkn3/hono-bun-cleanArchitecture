import { describe, expect, it, mock } from "bun:test";
import { HelloWorldController } from "./hello.world.controller";
import { HelloWorldUseCase } from "@/application/usecases/hello/usecase.impl";

describe("HelloWorldController", () => {
  it("メッセージを正しく返す", async () => {
    const mockContext = {
      req: {
        param: (name: string) => {
          if (name === "message") return "TestMessage";
          return undefined;
        }
      },
      json: mock((data: unknown) => {
        return { _data: data };
      })
    };

    const controller = new HelloWorldController(new HelloWorldUseCase());
    const result = await controller.main(mockContext as any) as any;

    expect(mockContext.json).toHaveBeenCalled();
    expect(result._data).toEqual({ message: "TestMessage" });
  });
});
