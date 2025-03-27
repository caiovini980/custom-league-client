import { IpcHandle } from '@main/ipc';
import { ServerService } from '@main/modules/server/server.service';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import {
  IpcFunctionParameters,
  IpcFunctionReturnType,
} from '@shared/typings/ipc.typing';

type IpcSessionsParam = IpcFunctionParameters['server'];
type IpcSessionsReturn = IpcFunctionReturnType['server'];

@Controller('server')
export class ServerController {
  constructor(private serverService: ServerService) {}

  @IpcHandle('sendInfo')
  async getServerInfo(
    @Payload() payload: IpcSessionsParam['sendInfo'],
  ): Promise<IpcSessionsReturn['sendInfo']> {
    return this.serverService.serverInfo(payload);
  }
}
