import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { CommonLogger } from '@main/logger/common-logger.abstract'

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private logger: CommonLogger
  ) {
    this.logger.setContext(AppService.name)
  }

  async onApplicationBootstrap(): Promise<void> {
    this.logger.info('App Startup')
  }
}
