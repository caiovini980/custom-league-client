import { ServiceAbstract } from '@main/abstracts/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { IpcException } from '@main/exceptions/ipc.exception';
import { LeagueClientService } from '@main/integrations/league-client/league-client.service';
import type { StoreView } from '@shared/typings/ipc-function/handle/store.typing';

@Service()
export class StoreService extends ServiceAbstract {
  constructor(private leagueClientService: LeagueClientService) {
    super();
  }

  async getStoreData(view: StoreView) {
    const storeUrl = await this.getStoreUrl();
    const accessToken = await this.getAccessToken();

    const { locale } = this.getClientStatusInfo();
    const url = `${storeUrl}/storefront/v3/view/${view}?language=${locale}`;
    this.logger.info(`Getting store data from: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return await response.json();
  }

  private async getStoreUrl() {
    this.logger.info('Getting store url');
    const res = await this.leagueClientService.handleEndpoint<string>(
      'GET',
      '/lol-store/v1/getStoreUrl',
      undefined,
    );
    if (res.ok) {
      return res.body;
    }
    throw new IpcException('badRequest', `store url error: ${res.body}`);
  }

  private async getAccessToken() {
    this.logger.info('Getting access token');
    const res = await this.leagueClientService.handleEndpoint<{
      token: string;
    }>('GET', '/lol-rso-auth/v1/authorization/access-token', undefined);
    if (res.ok) {
      return res.body.token as string;
    }
    throw new IpcException('badRequest', `store url error: ${res.body}`);
  }
}
