import type { Route } from '@/router/route';
import type { BaseController } from '@/adapters/ui/routes/base.controller';

export function createRoutings(controllers: {
  home: BaseController;
  helloWorld: BaseController;
  pokemon: BaseController;
}): Route[] {
  return [
    {
      name: 'home',
      controller: controllers.home,
      path: '/',
      methods: ['get'],
    },
    {
      name: 'pokemon',
      controller: controllers.pokemon,
      path: '/pokemon/:id',
      methods: ['get'],
    },
    {
      name: 'hello.world',
      controller: controllers.helloWorld,
      path: '/message/:message',
      methods: ['get'],
    }
  ];
}
