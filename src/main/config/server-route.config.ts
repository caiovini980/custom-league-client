import { ServerModule } from '@main/modules/server/server.module';
import { DynamicModule, Type } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

export const serverRouteConfig = (
  modules: Type[],
): (Type | DynamicModule)[] => {
  return [
    ...modules,
    RouterModule.register([
      {
        path: 'servers/:serverLanguageId',
        module: ServerModule,
        children: modules,
      },
    ]),
  ];
};
