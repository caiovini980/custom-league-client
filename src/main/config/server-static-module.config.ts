import { join } from 'node:path';
import { DynamicModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

export const serverStaticModuleConfig: DynamicModule =
  ServeStaticModule.forRoot({
    rootPath: join(process.cwd(), 'public'),
    serveRoot: '/public',
  });
