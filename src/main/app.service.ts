import path from 'node:path';
import { ServiceAbstract } from '@main/abstract/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { OnApplicationBootstrap } from '@nestjs/common';
import { app, net, protocol } from 'electron';
import fs from 'fs-extra';
import { DataSource } from 'typeorm';
import pLimit from 'p-limit';
import mime from 'mime';
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
    if (!fs.existsSync(this.getResourcePath())) {
      fs.mkdirSync(this.getResourcePath());
    }
  }

  async onApplicationBootstrap(): Promise<void> {
    this.logger.info('App Startup');
    await this.dataSource.runMigrations();
    this.setupProtocols();
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

  private setupProtocols() {
    const limit = pLimit(5);
    const ongoingDownloads = new Map<string, Promise<Response>>();

    const headers = (urlS: string, buffer: Buffer) => ({
      'Content-Type': mime.getType(urlS) || 'image/*',
      'Cache-Control': 'public, max-age=31536000',
      'Content-Length': buffer.length.toString(),
    });

    protocol.handle('media', async (request) => {
      const { version } = this.getClientStatusInfo();
      const urlS = request.url.replace('media://', '');
      const isNeedUpdateImageCache = this.isNeedUpdateImageCache(version, urlS);
      const filePath = path.join(this.getResourcePath(), urlS);
      const raw = `https://raw.communitydragon.org/latest/${urlS}`;

      if (fs.existsSync(filePath) && !isNeedUpdateImageCache) {
        const buffer = fs.readFileSync(filePath);
        return new Response(buffer, {
          headers: headers(urlS, buffer),
        });
      }

      return limit(async () => {
        if (ongoingDownloads.has(raw)) {
          return ongoingDownloads.get(raw) as Promise<Response>;
        }
        const promise = net
          .fetch(raw)
          .then((res) => {
            if (res.ok) {
              return res.arrayBuffer();
            }
            this.logger.error(`Error getting media: ${raw}`);
            return null;
          })
          .then((arrayBuffer) => {
            if (arrayBuffer) {
              const buffer = Buffer.from(arrayBuffer);
              fs.outputFile(filePath, buffer);
              return new Response(arrayBuffer, {
                headers: headers(urlS, buffer),
              });
            }
            return new Response(null, {
              status: 404,
            });
          });

        ongoingDownloads.set(raw, promise);

        promise.finally(() => ongoingDownloads.delete(raw));

        return promise;
      });
    });

    protocol.handle('local-media', async (request) => {
      const urlS = request.url.replace('local-media://', '');
      return limit(async () => {
        if (ongoingDownloads.has(urlS)) {
          return ongoingDownloads.get(urlS) as Promise<Response>;
        }
        const promise = this.leagueClientService
          .rawHandleEndpoint('GET', urlS, undefined)
          .then((res) => {
            if (res.ok) return res.buffer();
            this.logger.error(`Error on getting local media: ${urlS}`);
            return null;
          })
          .then((arrayBuffer) => {
            if (arrayBuffer) {
              const buffer = Buffer.from(arrayBuffer);
              return new Response(arrayBuffer, {
                headers: headers(urlS, buffer),
              });
            }
            return new Response(null, {
              status: 404,
            });
          });

        ongoingDownloads.set(urlS, promise);

        promise.finally(() => ongoingDownloads.delete(urlS));

        return promise;
      });
    });
  }

  private isNeedUpdateImageCache(version: string, imgPath: string) {
    const cacheJsonPath = path.join(this.getResourcePath(), 'imgCache.json');
    if (!fs.existsSync(cacheJsonPath)) {
      fs.writeJSONSync(cacheJsonPath, {});
    }
    const cache = fs.readJSONSync(cacheJsonPath);

    if (cache[imgPath] !== version) {
      cache[imgPath] = version;
      fs.writeJSONSync(cacheJsonPath, cache);
      return true;
    }
    return false;
  }
}
