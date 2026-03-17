import type { Context } from "hono";

export interface BaseController {
  main(c: Context): Promise<Response>;
}
