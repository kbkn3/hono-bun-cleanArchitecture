/**
 * ルーティング定義の集約
 */
import { Route } from '@/adapters/ui/routes/base.controller';

import { CONTROLLER_BINDINGS } from '@/keys';

export const routings: Route[] = [
  {
    name: 'pokemon',
    serviceName: CONTROLLER_BINDINGS.Pokemon,
    path: '/pokemon/:id',
    methods: ['get'],
  },
  {
    name: 'hello.world',
    serviceName: CONTROLLER_BINDINGS.HelloWorld,
    path: '/:message',
    methods: ['get'],
  }
];
