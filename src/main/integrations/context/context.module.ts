import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContextService } from './context.service';

@Global()
@Module({
  providers: [ContextService],
  exports: [ContextService],
  imports: [ConfigModule],
})
export class ContextModule {}
