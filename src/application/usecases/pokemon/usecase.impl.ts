import type {
  PokemonIdInputPort,
  PokemonIdInputUseCaseDto,
} from "@/application/usecases/pokemon/usecase";
import { PokemonIdOutputUseCaseDto } from "@/application/usecases/pokemon/usecase";

import type { PokemonRepository } from "@/application/repositories/pokemon/pokemon";

export class PokemonIdUseCase implements PokemonIdInputPort {
  constructor(
    private pokemonRepository: PokemonRepository
  ) {}

  async handle(input: PokemonIdInputUseCaseDto): Promise<PokemonIdOutputUseCaseDto> {
    const result = await this.pokemonRepository.getById({ id: input.pokemonId });
    const pokemon = result.pokemon;

    return new PokemonIdOutputUseCaseDto({
      id: pokemon.id,
      name: pokemon.name,
      baseExperience: pokemon.baseExperience,
      height: pokemon.height,
      weight: pokemon.weight,
      types: pokemon.types,
      abilities: pokemon.abilities,
      spriteUrl: pokemon.spriteUrl,
    });
  }
}
