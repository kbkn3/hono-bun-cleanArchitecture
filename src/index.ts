import "reflect-metadata";
import { Hono } from "hono";
import { setUpRoutes } from "@/router/router";
import { logger } from "hono/logger";
import { createContainer } from "@/container";

export const customLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest);
};

const container = createContainer();

const app = setUpRoutes(
  new Hono()
  .use(logger(customLogger)),
  container
);

export default app;
