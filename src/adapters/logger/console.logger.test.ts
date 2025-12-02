import { describe, expect, it, mock, spyOn, beforeEach, afterEach } from "bun:test";
import { ConsoleLogger } from "./console.logger";

describe("ConsoleLogger", () => {
  let logger: ConsoleLogger;
  let consoleSpy: {
    log: ReturnType<typeof spyOn>;
    warn: ReturnType<typeof spyOn>;
    error: ReturnType<typeof spyOn>;
    debug: ReturnType<typeof spyOn>;
  };

  beforeEach(() => {
    logger = new ConsoleLogger();
    consoleSpy = {
      log: spyOn(console, "log").mockImplementation(() => {}),
      warn: spyOn(console, "warn").mockImplementation(() => {}),
      error: spyOn(console, "error").mockImplementation(() => {}),
      debug: spyOn(console, "debug").mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    consoleSpy.log.mockRestore();
    consoleSpy.warn.mockRestore();
    consoleSpy.error.mockRestore();
    consoleSpy.debug.mockRestore();
  });

  describe("info", () => {
    it("INFOレベルでログを出力する", () => {
      logger.info("Test message");

      expect(consoleSpy.log).toHaveBeenCalled();
      const logMessage = consoleSpy.log.mock.calls[0][0] as string;
      expect(logMessage).toContain("[INFO]");
      expect(logMessage).toContain("Test message");
    });

    it("コンテキスト付きでログを出力する", () => {
      logger.info("Test message", { userId: 123 });

      const logMessage = consoleSpy.log.mock.calls[0][0] as string;
      expect(logMessage).toContain("userId");
      expect(logMessage).toContain("123");
    });
  });

  describe("warn", () => {
    it("WARNレベルでログを出力する", () => {
      logger.warn("Warning message");

      expect(consoleSpy.warn).toHaveBeenCalled();
      const logMessage = consoleSpy.warn.mock.calls[0][0] as string;
      expect(logMessage).toContain("[WARN]");
      expect(logMessage).toContain("Warning message");
    });
  });

  describe("error", () => {
    it("ERRORレベルでログを出力する", () => {
      logger.error("Error message");

      expect(consoleSpy.error).toHaveBeenCalled();
      const logMessage = consoleSpy.error.mock.calls[0][0] as string;
      expect(logMessage).toContain("[ERROR]");
      expect(logMessage).toContain("Error message");
    });

    it("Errorオブジェクト付きでスタックトレースを出力する", () => {
      const testError = new Error("Test error");
      logger.error("Error occurred", testError);

      const logMessage = consoleSpy.error.mock.calls[0][0] as string;
      expect(logMessage).toContain("Error occurred");
      expect(logMessage).toContain("Test error");
      expect(logMessage).toContain("stack");
    });

    it("Errorとコンテキスト両方を出力する", () => {
      const testError = new Error("Test error");
      logger.error("Error occurred", testError, { requestId: "req-123" });

      const logMessage = consoleSpy.error.mock.calls[0][0] as string;
      expect(logMessage).toContain("requestId");
      expect(logMessage).toContain("req-123");
    });
  });

  describe("debug", () => {
    it("DEBUGレベルでログを出力する", () => {
      logger.debug("Debug message");

      expect(consoleSpy.debug).toHaveBeenCalled();
      const logMessage = consoleSpy.debug.mock.calls[0][0] as string;
      expect(logMessage).toContain("[DEBUG]");
      expect(logMessage).toContain("Debug message");
    });
  });

  describe("timestamp", () => {
    it("ISO形式のタイムスタンプを含む", () => {
      logger.info("Test message");

      const logMessage = consoleSpy.log.mock.calls[0][0] as string;
      // ISO 8601形式のタイムスタンプパターン
      expect(logMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });
});
