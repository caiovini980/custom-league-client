import path from 'node:path';
import { ServiceAbstract } from '@main/abstract/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { OnApplicationBootstrap } from '@nestjs/common';
import { app, net, protocol } from 'electron';
import fs from 'fs-extra';
import { DataSource } from 'typeorm';
import { LeagueClientService } from '@main/integrations/league-client/league-client.service';

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
  }

  async onApplicationBootstrap(): Promise<void> {
    this.logger.info('App Startup');
    await this.dataSource.runMigrations();
    this.setupProtocols();
    this.mainWin.show();
    if (!app.isPackaged) {
      const tempPath = path.join(process.cwd(), '.temp');
      fs.writeFileSync(tempPath, this.getResourcePath(), {
        encoding: 'utf-8',
      });
    }
  }

  private setupProtocols() {
    protocol.handle('media', async (request) => {
      const urlS = request.url.replace('media://', '');
      const filePath = path.join(this.getResourcePath(), urlS);
      const raw = `https://raw.communitydragon.org/${urlS}`;
      this.logger.info(`Getting media: ${raw}`);
      const ft = net
        .fetch(raw)
        .then((res) => {
          if (res.ok) {
            return res.arrayBuffer();
          }
          return null;
        })
        .then((arrayBuffer) => {
          if (arrayBuffer) {
            fs.outputFile(filePath, Buffer.from(arrayBuffer));
            return new Response(arrayBuffer);
          }
          return new Response(null, {
            status: 404,
          });
        });
      if (fs.existsSync(filePath)) {
        return net.fetch(`file://${filePath}`);
      }
      return ft;
    });

    protocol.handle('local-media', async (request) => {
      const urlS = request.url.replace('local-media://', '');
      this.logger.info(`Getting local media: ${urlS}`);
      const data = await this.leagueClientService.rawHandleEndpoint(
        'GET',
        urlS,
        undefined,
      );
      if (data.ok) {
        return new Response(data.buffer());
      }
      return new Response(null, {
        status: 404,
      });
    });
  }
}
