import { IpcHandle } from '@main/ipc';
import { ClientService } from '@main/modules/client/client.service';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import type { ClientMakeRequestPayload } from '@shared/typings/ipc-function/handle/client.typing';

@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @IpcHandle('startLeagueClient')
  async startLeagueClient() {
    return this.clientService.startLeagueClient();
  }

  @IpcHandle('getClientStatus')
  async getClientStatus() {
    return this.clientService.getClientStatus();
  }

  @IpcHandle('makeRequest')
  async makeRequest(@Payload() payload: ClientMakeRequestPayload<string>) {
    return this.clientService.makeRequest(payload);
  }

  @IpcHandle('reloadGameData')
  async readGameData() {
    return this.clientService.reloadGameData();
  }
}
