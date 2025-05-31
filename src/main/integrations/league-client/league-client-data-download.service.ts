import * as path from 'node:path';
import { ServiceAbstract } from '@main/abstracts/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { LeagueClientDataReaderService } from '@main/integrations/league-client/league-client-data-reader.service';
import { ClientStatusConnected } from '@shared/typings/ipc-function/to-renderer/client-status.typing';
import { translateJsonMap } from '@shared/utils/translate.util';
import axios from 'axios';
import fs from 'fs-extra';
import * as https from 'node:https';
import { PassThrough } from 'node:stream';
import * as readline from 'node:readline';

@Service()
export class LeagueClientDataDownloadService extends ServiceAbstract {
  private IS_DOWNLOADING = false;
  private COMMUNITY_DRAGON_FILES_EXPORTED =
    'https://raw.communitydragon.org/{version}/cdragon/files.exported.txt';

  private FILE_LIST_TO_DENY: string[] = [];

  private FILE_LIST_TO_DOWNLOAD = [
    'plugins/rcp-be-lol-game-data/global/default/data/spells/icons2d',
    'plugins/rcp-be-lol-game-data/global/default/v1/champion-icons',
    'plugins/rcp-fe-lol-shared-components/global/default/unranked.png',
    'plugins/rcp-fe-lol-shared-components/global/default/iron.png',
    'plugins/rcp-fe-lol-shared-components/global/default/bronze.png',
    'plugins/rcp-fe-lol-shared-components/global/default/silver.png',
    'plugins/rcp-fe-lol-shared-components/global/default/gold.png',
    'plugins/rcp-fe-lol-shared-components/global/default/platinum.png',
    'plugins/rcp-fe-lol-shared-components/global/default/emerald.png',
    'plugins/rcp-fe-lol-shared-components/global/default/diamond.png',
    'plugins/rcp-fe-lol-shared-components/global/default/grandmaster.png',
    'plugins/rcp-fe-lol-shared-components/global/default/master.png',
    'plugins/rcp-fe-lol-shared-components/global/default/challenger.png',
  ];

  constructor(
    private leagueClientDataReaderService: LeagueClientDataReaderService,
  ) {
    super();
  }

  private async fetchFileList(url: string): Promise<string[]> {
    const filterAllow: RegExp[] = this.FILE_LIST_TO_DOWNLOAD.map(
      (r) => new RegExp(r),
    );
    const filterDeny: RegExp[] = this.FILE_LIST_TO_DENY.map(
      (r) => new RegExp(r),
    );

    Object.keys(translateJsonMap).forEach((k) => {
      filterAllow.push(new RegExp(`plugins/${k}/global/default/trans(.*)json`));
    });

    const urls: string[] = [];

    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          let data = '';
          const stream = new PassThrough();
          res.pipe(stream);

          const rl = readline.createInterface({ input: stream });

          rl.on('line', (line) => {
            const trimmed = line.trim();
            for (const regex of filterAllow) {
              if (regex.test(trimmed)) {
                let canDownload = true;
                for (const regex of filterDeny) {
                  if (regex.test(trimmed)) {
                    canDownload = false;
                    break;
                  }
                }
                if (canDownload) {
                  urls.push(trimmed);
                }
                break;
              }
            }
          });

          res.on('data', (chunk: string) => {
            data += chunk;
          });

          rl.on('close', () => resolve(urls));
          res.on('error', reject);
        })
        .on('error', reject);
    });
  }

  private async downloadFile(url: string, outputDir: string) {
    try {
      const fileName = path.basename(url);
      const outputPath = path.join(outputDir, fileName);

      const { data } = await axios.get(url, { responseType: 'arraybuffer' });
      await fs.outputFile(outputPath, data);

      this.logger.info(`Downloaded: ${url}`);
    } catch (error) {
      this.logger.error(`Download error ${url}:`, error);
    }
  }

  private async downloadInBatches(
    urls: string[],
    version: string,
    batchSize: number,
    output: string,
  ) {
    let lastSent = 0;
    let lastProgress = 0;
    const interval = 50;

    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const currentPercent = Math.ceil(
        ((i + batch.length) * 100) / urls.length,
      );
      this.logger.info(
        `Downloading files ${i + 1}-${i + batch.length} de ${urls.length}...`,
      );
      await Promise.all(
        batch.map((url) => {
          const now = Date.now();
          if (
            (currentPercent === 100 || now - lastSent >= interval) &&
            currentPercent !== lastProgress
          ) {
            this.sendMsgToRender('onLoadGameData', {
              status: 'downloading',
              info: {
                currentPercent,
                currentFileDownloading: url,
              },
            });
            lastProgress = currentPercent;
            lastSent = now;
          }
          return this.downloadFile(
            `https://raw.communitydragon.org/${version}/${url}`,
            path.join(output, path.dirname(url)),
          );
        }),
      );
    }
    this.logger.info('Download completed');
  }

  async downloadGameData(info: ClientStatusConnected['info']) {
    if (this.IS_DOWNLOADING) {
      this.logger.warn('GameData is downloading');
      return;
    }
    this.IS_DOWNLOADING = true;
    // Read this file (https://raw.communitydragon.org/latest/cdragon/files.exported.txt)
    // And download contents
    this.sendMsgToRender('onLoadGameData', {
      status: 'downloading',
      info: {
        currentPercent: 0,
        currentFileDownloading: '',
      },
    });
    this.logger.info(JSON.stringify(info));
    const version = 'latest';
    this.logger.info('Downloading file list...');
    const filteredUrls = await this.fetchFileList(
      this.COMMUNITY_DRAGON_FILES_EXPORTED.replace('{version}', version),
    );

    const output = this.getLolGameDataResourcePath(version);
    await fs.ensureDir(output);

    this.logger.info('Starting downloading...');
    await this.downloadInBatches(filteredUrls, version, 250, output);

    await this.leagueClientDataReaderService.readGameData(info);
    this.IS_DOWNLOADING = false;
  }
}
