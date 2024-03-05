import "reflect-metadata";
import { Hono } from "hono";
import { setUpRoutes } from "@/router/router";
import { logger } from "hono/logger";

const app = new Hono();

export const customLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest);
};

app.use(logger(customLogger));
app.route("", setUpRoutes());

export default app;
