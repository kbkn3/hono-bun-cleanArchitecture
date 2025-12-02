export const CONTROLLER_BINDINGS = {
  HelloWorld: Symbol.for("hello.world.controller"),
  Pokemon: Symbol.for("pokemon.controller")
};

export const USECASE_BINDINGS = {
  HelloWorld: Symbol.for("hello.world.usecase"),
  PokemonId: Symbol.for("pokemon.id.usecase")
};

export const REPOSITORY_BINDINGS = {
  Pokemon: Symbol.for("pokemon.repository")
};

export const POKENODE_BINDINGS = {
  PokeNode: Symbol.for("poke.node")
};

export const INFRASTRUCTURE_BINDINGS = {
  Logger: Symbol.for("logger")
};
