import { ClientController } from '@main/modules/client/client.controller';
import { ClientService } from '@main/modules/client/client.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
