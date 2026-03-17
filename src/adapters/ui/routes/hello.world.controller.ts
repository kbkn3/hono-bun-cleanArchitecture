import type { Context } from "hono";
import type { BaseController } from "./base.controller";
import type { HelloWorldInputPort } from "@/application/usecases/hello/usecase";

type BodyParams = {
  message: string;
};

export class HelloWorldController implements BaseController {
  constructor(
    private usecase: HelloWorldInputPort
  ) {}

  async main(c: Context) {
    const params = this.convertRequestToParams(c);
    const result = this.usecase.handle({ message: params.message });
    return c.json(result);
  }

  private convertRequestToParams(c: Context): BodyParams {
    const message = c.req.param('message') ?? '';
    return { message };
  }
}
