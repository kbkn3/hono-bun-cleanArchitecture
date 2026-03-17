import type { BaseController } from "@/adapters/ui/routes/base.controller";

export type Route = {
  name: string;
  controller: BaseController;
  methods: Method[];
  path: string;
};

type Method = 'get' | 'post';
