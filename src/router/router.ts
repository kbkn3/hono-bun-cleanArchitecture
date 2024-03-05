import { Hono } from "hono";

import { BaseController, Route } from "@/adapters/ui/routes/base.controller";
import { routings } from "@/router/routing.config";
import { createContainer } from "@/container";

export const setUpRoutes = () => {
  const app = new Hono();
  const container = createContainer();
  routings.forEach((route: Route) => {
    const controller = container.get<BaseController>(route.serviceName);
    app.get(route.path, (c) => controller.main(c));
  });
  return app;
};
