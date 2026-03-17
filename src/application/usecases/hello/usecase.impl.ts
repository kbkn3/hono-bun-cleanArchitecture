import type {
  HelloWorldInputPort,
  HelloWorldInputDto,
  HelloWorldOutputDto,
} from "@/application/usecases/hello/usecase";

export class HelloWorldUseCase implements HelloWorldInputPort {
  handle(input: HelloWorldInputDto): HelloWorldOutputDto {
    return { message: input.message };
  }
}
