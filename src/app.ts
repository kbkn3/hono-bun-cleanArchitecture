import { Hono } from "hono";
import { setUpRoutes } from "@/router/router";
import { createDependencies } from "@/container";
import { createRoutings } from "@/router/routing.config";
import { createErrorHandler } from "@/middleware/error-handler";
import { detailedLogger } from "@/middleware/logger";

export function createApp() {
  const { logger, controllers } = createDependencies();
  const routings = createRoutings(controllers);

  const app = new Hono()
    .use(detailedLogger({ logger }))
    .onError(createErrorHandler({ logger }));

  return setUpRoutes(app, routings);
}
