import { ServerController } from '@main/modules/server/server.controller';
import { ServerService } from '@main/modules/server/server.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ServerController],
  providers: [ServerService],
  exports: [ServerService],
})
export class ServerModule {}
