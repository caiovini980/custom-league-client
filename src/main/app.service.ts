import { Window } from '@main/ipc';
import { CommonLogger } from '@main/logger/common-logger.abstract';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BrowserWindow } from 'electron';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private logger: CommonLogger,
    @Window()
    private mainWin: BrowserWindow,
    private dataSource: DataSource,
  ) {
    this.logger.setContext(AppService.name);
  }

  async onApplicationBootstrap(): Promise<void> {
    this.logger.info('App Startup');
    await this.dataSource.runMigrations();
    this.mainWin.show();
  }
}
