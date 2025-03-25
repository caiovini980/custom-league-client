import { IpcHandle } from '@main/ipc';
import { ClientService } from '@main/modules/client/client.service';
import { Controller } from '@nestjs/common';

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
}
