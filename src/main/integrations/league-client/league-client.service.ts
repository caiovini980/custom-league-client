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
        this.changeConnectState(true);
      })
      .catch((err: Error) => {
        this.logger.error(err.message);
        this.changeConnectState(false);
      });

    createWebSocketConnection({
      authenticationOptions: {
        awaitConnection: true,
      },
      pollInterval: -1,
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
          console.error(e);
        }
      });
    });
  }

  onApplicationShutdown(_signal?: string) {
    this.logger.info('Stopping League Client Service...');
    this.client.stop();
  }

  setupConnection(): void {
    this.client.on('connect', (newCredentials) => {
      this.newCredentials = newCredentials;
      this.changeConnectState(true);
    });

    this.client.on('disconnect', () => {
      this.changeConnectState(false);
    });
  }

  isLeagueClientConnected() {
    return this.isConnected;
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

  async handleEndpoint(
    method: HttpRequestOptions['method'],
    url: string,
    body: unknown,
  ) {
    if (!this.isConnected) {
      this.logger.info('Client not connected');
      return {
        ok: false,
        status: -1,
        body: undefined,
      };
    }
    const response = await createHttp1Request(
      {
        method: method,
        url: url,
        body: body,
      },
      this.newCredentials,
    );

    return {
      ok: response.ok,
      status: response.status,
      body: response.json(),
    };
  }
}
