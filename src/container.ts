import { Container } from "inversify";
import { HelloWorldController } from "@/adapters/ui/routes/hello.world.controller";
import {
  CONTROLLER_BINDINGS,
  INFRASTRUCTURE_BINDINGS,
  REPOSITORY_BINDINGS,
  USECASE_BINDINGS,
} from "./keys";
import { PokemonController } from "./adapters/ui/routes/pokemon/pokemon.controller";
import type { PokemonIdInputPort } from "@/application/usecases/pokemon/usecase";
import type { PokemonRepository } from "@/application/repositories/pokemon/pokemon";
import type { ILogger } from "@/application/logger/logger";
import { PokemonImpl } from "@/adapters/gateways/gateways/pokemon.impl";
import { PokemonIdUseCase } from "@/application/usecases/pokemon/usecase.impl";
import { ConsoleLogger } from "@/adapters/logger/console.logger";

/**
 * DIコンテナを生成して返す
 */
export function createContainer(): Container {
  const container = new Container();
  bindInfrastructure(container);
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

/**
 * インフラストラクチャ層のサービスをDIコンテナにバインドする
 * @param container - DIコンテナ
 */
function bindInfrastructure(container: Container): void {
  container
    .bind<ILogger>(INFRASTRUCTURE_BINDINGS.Logger)
    .toConstantValue(new ConsoleLogger());
}
