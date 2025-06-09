import "reflect-metadata";
import { Hono } from "hono";
import { setUpRoutes } from "@/router/router";
import { logger } from "hono/logger";
import { createContainer } from "@/container";
import { errorHandler } from "@/middleware/error-handler";
import { detailedLogger } from "@/middleware/logger";

export const customLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest);
};

const container = createContainer();

const app = setUpRoutes(
  new Hono()
  .use(logger(customLogger))
  .use(detailedLogger())
  .use(errorHandler()),
  container
);

export default app;
