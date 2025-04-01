import { ServiceAbstract } from '@main/abstract/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import {
  Credentials,
  HttpRequestOptions,
  LeagueClient,
  authenticate,
  createHttp1Request,
  createWebSocketConnection,
} from 'league-connect';

@Service()
export class LeagueClientService
  extends ServiceAbstract
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private newCredentials!: Credentials;
  private client!: LeagueClient;
  private isConnected = false;

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
        this.changeConnectState(false);
      });
  }

  onApplicationShutdown(_signal?: string) {
    this.logger.info('Stopping League Client Service...');
    this.client.stop();
  }

  setupConnection(): void {
    this.tryConnection();
    this.client.on('connect', (newCredentials) => {
      this.newCredentials = newCredentials;
      this.tryConnection();
    });

    this.client.on('disconnect', () => {
      this.changeConnectState(false);
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

  private changeConnectState(isConnected: boolean) {
    this.isConnected = isConnected;
    this.sendMsgToRender('isClientConnected', isConnected);
    if (isConnected) {
      this.logger.info('Client instance connected.');
    } else {
      this.logger.info('Client instance disconnected.');
    }
  }

  private async tryConnection() {
    const res = await this.handleEndpoint(
      'GET',
      '/riot-messaging-service/v1/state',
      undefined,
    );
    if (res.ok) {
      this.killUX();
      this.startWb();
      this.changeConnectState(true);
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
          this.sendMsgToRender('onLeagueClientEvent', msgParsed);
        } catch (e) {
          this.logger.error(e);
        }
      });
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
}
