import { RouterModule } from '@nestjs/core'
import { ServerModule } from '@main/modules/server/server.module'
import { DynamicModule, Type } from '@nestjs/common'

export const serverRouteConfig = (modules: Type<any>[]): (Type<any> | DynamicModule)[] => {
  return [
    ...modules,
    RouterModule.register([
      {
        path: 'servers/:serverLanguageId',
        module: ServerModule,
        children: modules
      }
    ])
  ]
}
