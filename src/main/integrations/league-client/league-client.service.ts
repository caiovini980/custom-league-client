import { ServiceAbstract } from '@main/abstract/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientStatusConnected } from '@shared/typings/ipc-function/to-renderer/client-status.typing';
import { RiotClientRegionLocale } from '@shared/typings/lol/response/riotClientRegionLocale';
import { SystemV1Builds } from '@shared/typings/lol/response/systemV1Builds';
import { app } from 'electron';
import fs from 'fs-extra';
import {
  createHttp1Request,
  Credentials,
  HttpRequestOptions,
  LeagueWebSocket,
} from 'league-connect';
import path from 'node:path';
import { AppConfigService } from '@main/modules/app-config/app-config.service';
import * as https from 'node:https';

@Service()
export class LeagueClientService
  extends ServiceAbstract
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private credentials!: Credentials;
  private isConnected = false;

  constructor(
    private eventEmitter: EventEmitter2,
    private appConfigService: AppConfigService,
  ) {
    super();
  }

  async onApplicationBootstrap() {
    this.logger.info('Initiating League Client Service...');
    this.listenServer().then();
  }

  private async readLockfileAndGetCredentials() {
    const { RIOT_CLIENT_PATH } = await this.appConfigService.getAppConfig();
    if (!RIOT_CLIENT_PATH) {
      return;
    }
    const lockfilePath = path.join(
      RIOT_CLIENT_PATH,
      '..',
      'League of Legends',
      'lockfile',
    );
    try {
      const lockfileString = await fs.readFile(lockfilePath, {
        encoding: 'utf8',
      });
      const [_, processId, appPort, password] = lockfileString.split(':');
      this.credentials = {
        pid: Number(processId),
        port: Number(appPort),
        password,
      };
    } catch (e) {
      this.logger.error('Error on read lockfile');
      this.logger.error(e);
    }
  }

  private async listenServer() {
    await this.readLockfileAndGetCredentials();
    try {
      const res = await this.rawHandleEndpoint(
        'GET',
        '/riot-messaging-service/v1/state',
        undefined,
      );
      if (res.ok && !this.isConnected) {
        await this.startConnection();
      }
    } catch (e) {
      // @ts-ignore
      if ('code' in e) {
        if (e.code === 'ECONNREFUSED') {
          this.sendMsgClientDisconnected();
        }
      } else {
        this.logger.error(`Error Server: ${e}`);
      }
    }
    setTimeout(() => {
      this.listenServer();
    }, 1000);
  }

  async onApplicationShutdown(_signal?: string) {
    this.logger.info('Stopping League Client Service...');
    await this.launchUX();
  }

  isLeagueClientConnected() {
    return this.isConnected;
  }

  async rawHandleEndpoint(
    method: HttpRequestOptions['method'],
    url: string,
    body: unknown,
  ) {
    return await createHttp1Request(
      {
        method: method,
        url: url,
        body: body,
      },
      this.credentials,
    );
  }

  async handleEndpoint<T = unknown>(
    method: HttpRequestOptions['method'],
    url: string,
    body: unknown,
  ) {
    try {
      const response = await createHttp1Request(
        {
          method: method,
          url: url,
          body: body,
        },
        this.credentials,
      );

      let bodyRes = response.text();

      try {
        bodyRes = response.json();
      } catch (e) {}

      return {
        ok: response.ok,
        status: response.status,
        body: bodyRes as T,
      };
    } catch (e) {
      this.logger.error(`local request: ${e}`);
      return {
        ok: false,
        status: -1,
        body: undefined as T,
      };
    }
  }

  private sendMsgClientConnected(info: ClientStatusConnected['info']) {
    if (
      process.env.MAIN_VITE_KILL_LAUNCHER_ON_START === 'true' ||
      app.isPackaged
    ) {
      this.killUX();
    }
    this.logger.info('Client instance connected.');
    fs.writeFileSync(this.getClientInfoPath(), JSON.stringify(info), {
      encoding: 'utf-8',
    });
    this.sendMsgToRender('clientStatus', {
      connected: true,
      info,
    });
    this.eventEmitter.emit('client.connected', info);
    this.isConnected = true;
  }

  private sendMsgClientDisconnected() {
    this.isConnected = false;
    this.sendMsgToRender('clientStatus', {
      connected: false,
    });
    this.logger.info('Client instance disconnected.');
  }

  private async startConnection() {
    const regionRes = await this.handleEndpoint<RiotClientRegionLocale>(
      'GET',
      '/riotclient/region-locale',
      undefined,
    );
    const systemRes = await this.handleEndpoint<SystemV1Builds>(
      'GET',
      '/system/v1/builds',
      undefined,
    );

    if (regionRes.ok && systemRes.ok) {
      this.startWb();
      this.sendMsgClientConnected({
        locale: regionRes.body.locale,
        region: regionRes.body.region,
        version: 'latest', //systemRes.body.version.substring(0, 4),
      });
      this.launchUX();
      return;
    }
  }

  private startWb() {
    const { password, port } = this.credentials;
    const url = `wss://riot:${password}@127.0.0.1:${port}`;
    const ws = new LeagueWebSocket(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`riot:${password}`).toString('base64')}`,
      },
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    ws.on('message', (message) => {
      try {
        const msgString = Buffer.from(message as Buffer)
          .toString('utf-8')
          .trim();
        if (!msgString) return;
        const msgParsed = JSON.parse(msgString);
        this.saveLogFile(msgParsed);
        this.sendMsgToRender('onLeagueClientEvent', msgParsed);
      } catch (e) {
        this.logger.error(e);
      }
    });
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private saveLogFile(data: any) {
    if (app.isPackaged) return;
    if (process.env.MAIN_VITE_SAVE_LOG_LEAGUE_CLIENT !== 'true') return;
    const { uri } = data[2];
    const logPath = path.join(
      process.cwd(),
      'logs',
      `${uri.split('/')[1]}.log`,
    );
    fs.createFileSync(logPath);
    const obj = Object.assign(data[2], {
      timestamp: new Date().toISOString(),
    });
    fs.appendFile(logPath, `${JSON.stringify(obj)}\n`, {
      encoding: 'utf-8',
    });
  }

  private killUX() {
    this.handleEndpoint('POST', '/riotclient/kill-ux', undefined).then(
      (res) => {
        if (res.ok) {
          this.logger.info('ClientUX is finished');
        }
      },
    );
  }

  private async launchUX() {
    await this.handleEndpoint('POST', '/riotclient/launch-ux', undefined).then(
      (res) => {
        if (res.ok) {
          this.logger.info('ClientUX is launched');
        }
      },
    );
  }
}
