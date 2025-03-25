import { Window } from '@main/ipc';
import { CommonLogger } from '@main/logger/common-logger.abstract';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BrowserWindow } from 'electron';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private logger: CommonLogger,
    @Window()
    private mainWin: BrowserWindow,
  ) {
    this.logger.setContext(AppService.name);
  }

  async onApplicationBootstrap(): Promise<void> {
    this.logger.info('App Startup');
    this.mainWin.show();
  }
}
