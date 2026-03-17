import { Hono } from "hono";
import type { Route } from "@/router/route";

export const setUpRoutes = (app: Hono, routings: Route[]) => {
  for (const route of routings) {
    const handler = (c: Parameters<typeof route.controller.main>[0]) => route.controller.main(c);

    for (const method of route.methods) {
      app[method](route.path, handler);
    }
  }
  return app;
};
