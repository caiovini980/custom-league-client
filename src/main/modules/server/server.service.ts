import { ServiceAbstract } from '@main/abstract/service.abstract';
import { Service } from '@main/decorators/service.decorator';

@Service()
export class ServerService extends ServiceAbstract {
  async serverInfo(serverInfo: string) {
    this.logger.info(`Server info is: ${serverInfo}`);
    this.sendMsgToRender('serverUp', true);
  }
}
