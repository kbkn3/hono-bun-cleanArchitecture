import type { Context } from "hono";
import type { BaseController } from "../base.controller";
import type { PokemonIdInputPort } from "@/application/usecases/pokemon/usecase";
import type { PokemonPresenter } from "@/adapters/ui/routes/pokemon/presenter";
import { PokemonId } from "@/domain/pokemon/pokemon.id";
import { ApplicationStatusError, Status } from "@/domain/error";

type BodyParams = {
  id: PokemonId;
};

export class PokemonController implements BaseController {
  constructor(
    private usecase: PokemonIdInputPort,
    private presenter: PokemonPresenter
  ) {}

  async main(c: Context) {
    const params = this.convertRequestToParams(c);
    return await this.mainFn(c, params);
  }

  private async mainFn(c: Context, params: BodyParams) {
    const result = await this.usecase.handle({ pokemonId: params.id });
    const response = this.presenter.handle(result);
    return c.json(response, 200);
  }

  private convertRequestToParams(c: Context): BodyParams {
    const raw = c.req.param("id") ?? "";
    const id = Number.parseInt(raw, 10);
    if (!Number.isFinite(id) || String(id) !== raw) {
      throw new ApplicationStatusError(`Invalid PokemonId: ${raw}`, Status.ILLEGAL_DATA);
    }
    return {
      id: PokemonId.createRequired(id),
    };
  }
}
