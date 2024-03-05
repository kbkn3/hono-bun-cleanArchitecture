import { StatusCode } from '@/domain/status.code';

export class PokemonPresenterDto {
  readonly statusCode: number = StatusCode.OK;
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
