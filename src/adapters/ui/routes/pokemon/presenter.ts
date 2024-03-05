import { PokemonPresenterDto } from "@/adapters/ui/routes/pokemon/view";
import { PokemonIdOutputUseCaseDto } from "@/application/usecases/pokemon/usecase";

export class PokemonPresenter {
  handle(dto: PokemonIdOutputUseCaseDto): PokemonPresenterDto {
    const types = dto.types.map((type) => type.type.name);
    return new PokemonPresenterDto({
      id: dto.id,
      name: dto.name,
      types: types,
    });
  }
}
