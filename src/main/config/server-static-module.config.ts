import { DynamicModule } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import process from 'process'

export const serverStaticModuleConfig: DynamicModule = ServeStaticModule.forRoot({
  rootPath: join(process.cwd(), 'public'),
  serveRoot: '/public'
})
