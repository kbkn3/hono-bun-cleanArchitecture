export interface HelloWorldInputPort {
  handle(input: HelloWorldInputDto): HelloWorldOutputDto;
}

export interface HelloWorldInputDto {
  message: string;
}

export interface HelloWorldOutputDto {
  message: string;
}
