import path from 'node:path';
import { ServiceAbstract } from '@main/abstract/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { LeagueClientService } from '@main/integrations/league-client/league-client.service';
import { OnApplicationBootstrap } from '@nestjs/common';
import { app } from 'electron';
import fs from 'fs-extra';
import { DataSource } from 'typeorm';

@Service()
export class AppService
  extends ServiceAbstract
  implements OnApplicationBootstrap
{
  constructor(
    private dataSource: DataSource,
    private leagueClientService: LeagueClientService,
  ) {
    super();
    fs.ensureDirSync(this.getResourcePath());
  }

  async onApplicationBootstrap(): Promise<void> {
    this.logger.info('App Startup');
    await this.dataSource.runMigrations();
    this.logger.info('Initiating League Client Service...');
    this.leagueClientService.startListenServer().then();
    this.mainWin.maximize();
    this.mainWin.show();
    if (!app.isPackaged) {
      const tempPath = path.join(process.cwd(), '.temp');
      fs.writeFileSync(tempPath, this.getResourcePath(), {
        encoding: 'utf-8',
      });
    }
  }
}
