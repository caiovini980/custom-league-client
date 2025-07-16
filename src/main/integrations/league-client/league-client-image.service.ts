import { createHash } from 'node:crypto';
import path from 'node:path';
import { ServiceAbstract } from '@main/abstract/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { LeagueClientService } from '@main/integrations/league-client/league-client.service';
import { OnApplicationBootstrap } from '@nestjs/common';
import { net, protocol } from 'electron';
import fs from 'fs-extra';
import mime from 'mime';
import pLimit from 'p-limit';

interface CacheEntry {
  buffer: Buffer;
  mime: string;
  etag: string;
}

@Service()
export class LeagueClientImageService
  extends ServiceAbstract
  implements OnApplicationBootstrap
{
  private readonly MAX_CACHE_SIZE = 500;

  private memoryCacheLocalMedia = new Map<string, CacheEntry>();
  private ongoingDownloadsLocalMedia = new Map<string, Promise<Response>>();
  private ongoingDownloadsMedia = new Map<string, Promise<Response>>();
  private limitLocalMedia = pLimit(10);
  private limitMedia = pLimit(10);

  constructor(private leagueClientService: LeagueClientService) {
    super();
  }

  onApplicationBootstrap() {
    protocol.handle('media', async (request) => {
      return this.getExternalMedia(request);
    });

    protocol.handle('local-media', async (request) => {
      return this.getLocalMedia(request);
    });
  }

  private async getLocalMedia(request: Request) {
    const urlS = request.url.replace('local-media://', '');
    const cacheKey = urlS;

    if (this.memoryCacheLocalMedia.has(cacheKey)) {
      // biome-ignore lint/style/noNonNullAssertion: none
      const entry = this.memoryCacheLocalMedia.get(cacheKey)!;

      this.memoryCacheLocalMedia.delete(cacheKey);
      this.memoryCacheLocalMedia.set(cacheKey, entry);

      return new Response(entry.buffer, {
        headers: this.headers(urlS, entry.buffer),
      });
    }

    return this.limitLocalMedia(async () => {
      if (this.ongoingDownloadsLocalMedia.has(urlS)) {
        return this.ongoingDownloadsLocalMedia.get(urlS) as Promise<Response>;
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
              headers: this.headers(urlS, buffer, true),
            });
          }
          return new Response(null, {
            status: 404,
          });
        });

      this.ongoingDownloadsLocalMedia.set(urlS, promise);

      promise.finally(() => this.ongoingDownloadsLocalMedia.delete(urlS));

      return promise;
    });
  }

  private async getExternalMedia(request: Request) {
    const { version } = this.getClientStatusInfo();
    const urlS = request.url.replace('media://', '');
    const isNeedUpdateImageCache = this.isNeedUpdateImageCache(version, urlS);
    const filePath = path.join(this.getResourcePath(), urlS);
    const raw = `https://raw.communitydragon.org/latest/${urlS}`;

    if (fs.existsSync(filePath) && !isNeedUpdateImageCache) {
      const buffer = fs.readFileSync(filePath);
      return new Response(buffer, {
        headers: this.headers(urlS, buffer),
      });
    }

    return this.limitMedia(async () => {
      if (this.ongoingDownloadsMedia.has(raw)) {
        return this.ongoingDownloadsMedia.get(raw) as Promise<Response>;
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
              headers: this.headers(urlS, buffer),
            });
          }
          return new Response(null, {
            status: 404,
          });
        });

      this.ongoingDownloadsMedia.set(raw, promise);

      promise.finally(() => this.ongoingDownloadsMedia.delete(raw));

      return promise;
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

  private addToCache(key: string, entry: CacheEntry) {
    if (this.memoryCacheLocalMedia.has(key)) {
      this.memoryCacheLocalMedia.delete(key); // move para o topo
    }
    this.memoryCacheLocalMedia.set(key, entry);

    if (this.memoryCacheLocalMedia.size > this.MAX_CACHE_SIZE) {
      const firstKey = this.memoryCacheLocalMedia.keys().next().value;
      if (firstKey) this.memoryCacheLocalMedia.delete(firstKey);
    }
  }

  private headers(urlS: string, buffer: Buffer, addCache?: boolean) {
    const contentType = mime.getType(urlS) || 'image/*';
    const etag = `"${createHash('md5').update(buffer).digest('hex')}"`;
    if (addCache) {
      const entry: CacheEntry = { buffer, mime: contentType, etag };
      this.addToCache(urlS, entry);
    }

    return {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Length': buffer.length.toString(),
      ETag: etag,
    };
  }
}
