import type { ILogger } from "@/application/logger/logger";
import type { PokemonRepository } from "@/application/repositories/pokemon/pokemon";
import type { BaseController } from "@/adapters/ui/routes/base.controller";
import { ConsoleLogger } from "@/adapters/logger/console.logger";
import { PokemonImpl } from "@/adapters/gateways/pokemon.impl";
import { CachingPokemonRepository } from "@/adapters/gateways/caching.pokemon.repository";
import { PokemonIdUseCase } from "@/application/usecases/pokemon/usecase.impl";
import { HelloWorldUseCase } from "@/application/usecases/hello/usecase.impl";
import { PokemonPresenter } from "@/adapters/ui/routes/pokemon/presenter";
import { PokemonController } from "@/adapters/ui/routes/pokemon/pokemon.controller";
import { HelloWorldController } from "@/adapters/ui/routes/hello.world.controller";
import { HomeController } from "@/adapters/ui/routes/home.controller";

export interface AppDependencies {
  logger: ILogger;
  controllers: {
    home: BaseController;
    helloWorld: BaseController;
    pokemon: BaseController;
  };
}

/**
 * 全ての依存関係を手動で構築して返す（Composition Root）
 */
export function createDependencies(): AppDependencies {
  // Infrastructure
  const logger = new ConsoleLogger();

  // Repositories
  const pokemonApi = new PokemonImpl(logger);
  const pokemonRepository: PokemonRepository = new CachingPokemonRepository(pokemonApi);

  // UseCases
  const pokemonIdUseCase = new PokemonIdUseCase(pokemonRepository);
  const helloWorldUseCase = new HelloWorldUseCase();

  // Presenters
  const pokemonPresenter = new PokemonPresenter();

  // Controllers
  const homeController = new HomeController();
  const helloWorldController = new HelloWorldController(helloWorldUseCase);
  const pokemonController = new PokemonController(pokemonIdUseCase, pokemonPresenter);

  return {
    logger,
    controllers: {
      home: homeController,
      helloWorld: helloWorldController,
      pokemon: pokemonController,
    },
  };
}
