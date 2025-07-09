import { ServiceAbstract } from '@main/abstract/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { OnApplicationShutdown } from '@nestjs/common';
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

export interface HandleEndpointResponse<T = unknown> {
  ok: boolean;
  status: number;
  body: T;
}

@Service()
export class LeagueClientService
  extends ServiceAbstract
  implements OnApplicationShutdown
{
  private credentials!: Credentials;
  private isConnected = false;
  private promises: Map<string, Promise<HandleEndpointResponse>> = new Map();

  constructor(
    private eventEmitter: EventEmitter2,
    private appConfigService: AppConfigService,
  ) {
    super();
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
      return true;
    } catch (e) {
      this.logger.error('Error on read lockfile');
      this.logger.error(e);
    }
    return false;
  }

  async startListenServer() {
    const hasCredentials = await this.readLockfileAndGetCredentials();
    if (!hasCredentials) {
      this.sendMsgClientDisconnected();
    } else {
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
    }
    setTimeout(() => {
      this.startListenServer();
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
  ): Promise<HandleEndpointResponse<T>> {
    const key = `${method}::${url}::${JSON.stringify(body)}`;

    if (this.promises.has(key)) {
      return this.promises.get(key) as Promise<HandleEndpointResponse<T>>;
    }
    const response = createHttp1Request(
      {
        method: method,
        url: url,
        body: body,
      },
      this.credentials,
    )
      .then((response) => {
        let bodyRes = response.text();

        try {
          bodyRes = response.json();
        } catch (e) {}

        return {
          ok: response.ok,
          status: response.status,
          body: bodyRes as T,
        };
      })
      .catch((e) => {
        this.logger.error(`local request: ${e}`);
        return {
          ok: false,
          status: -1,
          body: undefined as T,
        };
      })
      .finally(() => {
        this.promises.delete(key);
      });

    this.promises.set(key, response);

    return response;
  }

  private sendMsgClientConnected(info: ClientStatusConnected['info']) {
    if (
      process.env.MAIN_VITE_KILL_LAUNCHER_ON_START === 'true' ||
      app.isPackaged
    ) {
      this.killUX();
    }
    this.logger.info('Client instance connected.');
    fs.writeJSONSync(this.getClientInfoPath(), info);
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
      info: this.getClientStatusInfo(),
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
      const [major, minor] = systemRes.body.version.split('.');
      this.startWb();
      this.sendMsgClientConnected({
        locale: regionRes.body.locale,
        region: regionRes.body.region,
        version: `${major}.${minor}`,
      });
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
