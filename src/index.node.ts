import "reflect-metadata";
import { serve } from '@hono/node-server';
import { Hono } from "hono";
import { setUpRoutes } from "@/router/router";
import { logger } from "hono/logger";
import { createContainer } from "@/container";
import { errorHandler } from "@/middleware/error-handler";
import { detailedLogger } from "@/middleware/logger";
import { INFRASTRUCTURE_BINDINGS } from "@/keys";
import type { ILogger } from "@/application/logger/logger";

export const customLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest);
};

const container = createContainer();
const appLogger = container.get<ILogger>(INFRASTRUCTURE_BINDINGS.Logger);

const app = setUpRoutes(
  new Hono()
  .use(logger(customLogger))
  .use(detailedLogger())
  .use(errorHandler({ logger: appLogger })),
  container
);

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});