import { IpcHandle } from '@main/ipc';
import { ClientService } from '@main/modules/client/client.service';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import type { ClientMakeRequestPayload } from '@shared/typings/ipc-function/handle/client.typing';

@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @IpcHandle('startAuthenticate')
  async startAuthenticate() {
    return this.clientService.startAuthenticate();
  }

  @IpcHandle('startLeagueClient')
  async startLeagueClient() {
    return this.clientService.startLeagueClient();
  }

  @IpcHandle('getIsClientConnected')
  async getIsClientConnected() {
    return this.clientService.getIsClientConnected();
  }

  @IpcHandle('makeRequest')
  async makeRequest(@Payload() payload: ClientMakeRequestPayload) {
    return this.clientService.makeRequest(payload);
  }
}
