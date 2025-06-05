import { Hono } from "hono";

import { BaseController, Route } from "@/adapters/ui/routes/base.controller";
import { routings } from "@/router/routing.config";
import { Container } from 'inversify';

export const setUpRoutes = (app: Hono, container: Container) => {
  routings.forEach((route: Route) => {
    const controller = container.get<BaseController>(route.serviceName);
    app.get(route.path, (c) => controller.main(c));
  });
  return app;
};
