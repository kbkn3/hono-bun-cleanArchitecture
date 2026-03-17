export class PokemonPresenterDto {
  readonly result: PokemonResultDto;

  constructor(result: PokemonResultDto) {
    this.result = result;
  }
}

export type PokemonResultDto = {
    id: number;
    name: string;
    types: string[];
};
