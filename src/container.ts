import { Container } from "inversify";
import { HelloWorldController } from "@/adapters/ui/routes/hello.world.controller";
import {
  CONTROLLER_BINDINGS,
  REPOSITORY_BINDINGS,
  USECASE_BINDINGS,
} from "./keys";
import { PokemonController } from "./adapters/ui/routes/pokemon/pokemon.controller";
import { PokemonIdInputPort } from "@/application/usecases/pokemon/usecase";
import { PokemonRepository } from "@/application/repositories/pokemon/pokemon";
import { PokemonImpl } from "@/adapters/gateways/gateways/pokemon.impl";
import { PokemonIdUseCase } from "@/application/usecases/pokemon/usecase.impl";

/**
 * DIコンテナを生成して返す
 */
export function createContainer(): Container {
  const container = new Container();
  bindControllers(container);
  bindUseCases(container);
  bindRepositories(container);
  // bindGatewayDataSources(container);

  return container;
}

/**
 * コントローラをDIコンテナにバインドする
 * @param container - DIコンテナ
 */
function bindControllers(container: Container): void {
  container
    .bind<HelloWorldController>(CONTROLLER_BINDINGS.HelloWorld)
    .to(HelloWorldController);
  container
    .bind<PokemonController>(CONTROLLER_BINDINGS.Pokemon)
    .to(PokemonController);
}

/**
 * ユースケースをDIコンテナにバインドする
 * @param container - DIコンテナ
 */
function bindUseCases(container: Container): void {
  container
    .bind<PokemonIdInputPort>(USECASE_BINDINGS.PokemonId)
    .to(PokemonIdUseCase);
}

/**
 * リポジトリをDIコンテナにバインドする
 * @param container - DIコンテナ
 */
function bindRepositories(container: Container): void {
  container
    .bind<PokemonRepository>(REPOSITORY_BINDINGS.Pokemon)
    .to(PokemonImpl);
}
