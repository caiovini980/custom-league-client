import { spawn } from 'node:child_process';
import { ServiceAbstract } from '@main/abstract/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { IpcException } from '@main/exceptions/ipc.exception';
import { LeagueClientService } from '@main/integrations/league-client/league-client.service';
import { LeagueClientDataDownloadService } from '@main/integrations/league-client/league-client-data-download.service';
import { AppConfigService } from '@main/modules/app-config/app-config.service';
import { OnApplicationBootstrap } from '@nestjs/common';
import {
  ClientMakeRequestPayload,
  ClientMakeRequestResponse,
  GetPatchNotesResponse,
} from '@shared/typings/ipc-function/handle/client.typing';
import { ClientStatusResponse } from '@shared/typings/ipc-function/to-renderer/client-status.typing';
import * as cheerio from 'cheerio';

@Service()
export class ClientService
  extends ServiceAbstract
  implements OnApplicationBootstrap
{
  private showClient = true;

  constructor(
    private leagueClientService: LeagueClientService,
    private leagueClientDataDownloadService: LeagueClientDataDownloadService,
    private appConfigService: AppConfigService,
  ) {
    super();
  }

  onApplicationBootstrap() {
    setInterval(() => {
      if (
        !this.showClient &&
        this.leagueClientService.isLeagueClientConnected()
      ) {
        this.leagueClientService.handleEndpoint(
          'POST',
          '/riotclient/kill-ux',
          undefined,
        );
      }
    }, 100);
  }

  async startLeagueClient() {
    const appConfig = await this.appConfigService.getAppConfig();
    const child = spawn(
      `${appConfig.RIOT_CLIENT_PATH}\\RiotClientServices.exe`,
      [
        '--launch-product=league_of_legends',
        '--launch-patchline=live',
        '--',
        '--headless',
      ],
      {
        detached: true,
        stdio: 'ignore',
      },
    );
    ['error', 'spawn', 'exit', 'close', 'message', 'disconnect'].forEach(
      (ev) => {
        child.on(ev, (args: unknown[]) => {
          console.log(ev, args);
          if (ev === 'exit') {
            this.sendMsgToRender('processStatus', 'exited');
          }
          if (ev === 'spawn') {
            this.sendMsgToRender('processStatus', 'initialized');
          }
        });
      },
    );
  }

  getClientStatus(): ClientStatusResponse {
    const isConnected = this.leagueClientService.isLeagueClientConnected();
    return {
      connected: isConnected,
      info: this.getClientStatusInfo(),
    };
  }

  async makeRequest(
    data: ClientMakeRequestPayload<string>,
  ): Promise<ClientMakeRequestResponse> {
    this.logger.debug(`make request: ${JSON.stringify(data)}`);
    return await this.leagueClientService.handleEndpoint(
      data.method,
      data.uri,
      data.data,
    );
  }

  async reloadGameData() {
    if (this.leagueClientService.isLeagueClientConnected()) {
      await this.leagueClientDataDownloadService.downloadGameData(
        this.getClientStatusInfo(),
      );
      return;
    }
    throw new IpcException('unknownError', 'Client not connected');
  }

  async priorityApp() {
    this.mainWin.show();
    this.mainWin.setAlwaysOnTop(true, 'screen-saver');
    this.mainWin.flashFrame(true);
    setTimeout(() => {
      this.mainWin.flashFrame(false);
      this.mainWin.setAlwaysOnTop(false);
    }, 5000);
  }

  async blink() {
    this.mainWin.flashFrame(true);
  }

  async changeShowClient(value: boolean) {
    this.showClient = value;
    if (value) {
      setTimeout(() => {
        this.makeRequest({
          method: 'POST',
          uri: '/riotclient/launch-ux',
          data: undefined,
        });
      }, 200);
    }
  }

  async getPatchNotes(): Promise<GetPatchNotesResponse> {
    const info = this.getClientStatusInfo();
    const url = `https://embed.rgpub.io/league-client-blades/${info.locale.toLowerCase().replace('_', '-')}/latest-patch-notes`;

    try {
      const html = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      }).then((res) => res.text());
      const $ = cheerio.load(html);

      const getMeta = (property) =>
        $(`meta[property='${property}']`).attr('content') ||
        $(`meta[name='${property}']`).attr('content');

      return {
        title: getMeta('og:title') || $('title').text(),
        description: getMeta('og:description') || '',
        img: getMeta('og:image')?.replace(/\?.*/, '') || '',
        urlExternal: getMeta('og:url') || '',
        urlEmbed: url,
      };
    } catch (error) {
      // @ts-ignore
      this.logger.error('Error on get metadata:', error.message);
      return {
        urlEmbed: '',
        urlExternal: '',
        img: '',
        title: '',
        description: '',
      };
    }
  }
}
