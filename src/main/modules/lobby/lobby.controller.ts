import { IpcHandle } from '@main/ipc';
import { LobbyService } from '@main/modules/lobby/lobby.service';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import {
  IpcFunctionParameters,
  IpcFunctionReturnType,
} from '@shared/typings/ipc.typing';

type IpcSessionsParam = IpcFunctionParameters['lobby'];
type IpcSessionsReturn = IpcFunctionReturnType['lobby'];

@Controller('lobby')
export class LobbyController {
  constructor(private lobbyService: LobbyService) {}

  @IpcHandle('createAram')
  async getServerInfo(
    @Payload() payload: IpcSessionsParam['createAram'],
  ): Promise<IpcSessionsReturn['createAram']> {
    return this.lobbyService.createAram();
  }
}