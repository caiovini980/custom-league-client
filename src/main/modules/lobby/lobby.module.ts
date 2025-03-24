import { LobbyController } from '@main/modules/lobby/lobby.controller';
import { LobbyService } from '@main/modules/lobby/lobby.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [LobbyController],
  providers: [LobbyService],
  exports: [LobbyService],
})

export class LobbyModule {}