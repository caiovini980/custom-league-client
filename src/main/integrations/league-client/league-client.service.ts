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
  Credentials,
  HttpRequestOptions,
  LeagueClient,
  authenticate,
  createHttp1Request,
  createWebSocketConnection,
} from 'league-connect';
import path from 'node:path';

@Service()
export class LeagueClientService
  extends ServiceAbstract
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private newCredentials!: Credentials;
  private client!: LeagueClient;
  private isConnected = false;

  constructor(private eventEmitter: EventEmitter2) {
    super();
  }

  async onApplicationBootstrap() {
    this.logger.info('Initiating League Client Service...');
    this.startAuthenticate();
  }

  startAuthenticate() {
    authenticate({
      awaitConnection: true,
    })
      .then((credentials) => {
        const client = new LeagueClient(credentials);
        this.newCredentials = credentials;
        this.client = client;

        this.setupConnection();
        this.client.start();
      })
      .catch((err: Error) => {
        this.logger.error(err.message);
        this.sendMsgClientDisconnected();
      });
  }

  async onApplicationShutdown(_signal?: string) {
    this.logger.info('Stopping League Client Service...');
    await this.launchUX();
    this.client.stop();
  }

  setupConnection(): void {
    this.tryConnection();
    this.client.on('connect', (newCredentials) => {
      this.newCredentials = newCredentials;
      this.tryConnection();
    });

    this.client.on('disconnect', () => {
      this.sendMsgClientDisconnected();
    });
  }

  isLeagueClientConnected() {
    return this.isConnected;
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
        this.newCredentials,
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
    this.isConnected = true;
    if (
      process.env.MAIN_VITE_KILL_LAUNCHER_ON_START === 'true' ||
      app.isPackaged
    ) {
      this.killUX();
    }
    this.logger.info('Client instance connected.');
    fs.writeFileSync(this.getClientInfoPath(), JSON.stringify(info));
    this.sendMsgToRender('clientStatus', {
      connected: true,
      info,
    });
    this.eventEmitter.emit('client.connected', info);
  }

  private sendMsgClientDisconnected() {
    this.isConnected = false;
    this.sendMsgToRender('clientStatus', {
      connected: false,
    });
    this.logger.info('Client instance disconnected.');
  }

  private async tryConnection() {
    const res = await this.handleEndpoint(
      'GET',
      '/riot-messaging-service/v1/state',
      undefined,
    );
    if (!res.ok) {
      setTimeout(() => {
        this.tryConnection();
      }, 1000);
      return;
    }
    this.startWb();
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
      this.sendMsgClientConnected({
        locale: regionRes.body.locale,
        region: regionRes.body.region,
        version: 'latest', //systemRes.body.version.substring(0, 4),
      });
      return;
    }
    setTimeout(() => {
      this.tryConnection();
    }, 1000);
  }

  private startWb() {
    createWebSocketConnection({
      authenticationOptions: {
        awaitConnection: true,
      },
      maxRetries: -1,
    }).then((ws) => {
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
    });
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  private saveLogFile(data: any) {
    if (app.isPackaged) return;
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
