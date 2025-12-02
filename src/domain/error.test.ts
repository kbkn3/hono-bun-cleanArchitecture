import { describe, expect, it } from "bun:test";
import { ApplicationConfigurationError, ApplicationStatusError, Status } from "./error";

describe("Error", () => {
  describe("Status", () => {
    it("正しいメッセージを返す", () => {
      expect(Status.SUCCESS.toMessage()).toBe("Success");
      expect(Status.NOT_FOUND.toMessage()).toBe("Not Found");
      expect(Status.BFF_SYSTEM_ERROR.toMessage()).toBe("BFF System Error");
      expect(Status.ILLEGAL_DATA.toMessage()).toBe("Illegal Data");
    });
  });

  describe("ApplicationConfigurationError", () => {
    it("正しいエラーメッセージを生成する", () => {
      const error = new ApplicationConfigurationError("Missing env var");
      expect(error.message).toBe("BFF Configuration Error: Missing env var");
    });

    it("スタックトレースを保持する", () => {
      const error = new ApplicationConfigurationError("Missing env var");
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain("ApplicationConfigurationError");
    });

    it("正しいエラー名を持つ", () => {
      const error = new ApplicationConfigurationError("Missing env var");
      expect(error.name).toBe("ApplicationConfigurationError");
    });
  });

  describe("ApplicationStatusError", () => {
    it("正しいエラーメッセージを生成する", () => {
      const error = new ApplicationStatusError("Invalid data", Status.ILLEGAL_DATA);
      expect(error.message).toBe("BFF Application Status Error status: Illegal Data message: Invalid data");
    });

    it("statusプロパティを保持する", () => {
      const error = new ApplicationStatusError("Invalid data", Status.ILLEGAL_DATA);
      expect(error.status).toBe(Status.ILLEGAL_DATA);
    });

    it("スタックトレースを保持する", () => {
      const error = new ApplicationStatusError("Invalid data", Status.ILLEGAL_DATA);
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain("ApplicationStatusError");
    });

    it("正しいエラー名を持つ", () => {
      const error = new ApplicationStatusError("Invalid data", Status.ILLEGAL_DATA);
      expect(error.name).toBe("ApplicationStatusError");
    });
  });
});
