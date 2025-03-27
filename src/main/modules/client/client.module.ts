import { AppConfigModule } from '@main/modules/app-config/app-config.module';
import { ClientController } from '@main/modules/client/client.controller';
import { ClientService } from '@main/modules/client/client.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [AppConfigModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
