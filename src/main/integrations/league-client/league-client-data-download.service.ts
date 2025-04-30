import * as path from 'node:path';
import { ServiceAbstract } from '@main/abstracts/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { LeagueClientDataReaderService } from '@main/integrations/league-client/league-client-data-reader.service';
import { ClientStatusConnected } from '@shared/typings/ipc-function/to-renderer/client-status.typing';
import { translateJsonMap } from '@shared/utils/translate.util';
import axios from 'axios';
import fs from 'fs-extra';

@Service()
export class LeagueClientDataDownloadService extends ServiceAbstract {
  private COMMUNITY_DRAGON_FILES_EXPORTED =
    'https://raw.communitydragon.org/{version}/cdragon/files.exported.txt';

  private FILE_LIST_TO_DOWNLOAD = [
    'plugins/rcp-be-lol-game-data/global/default/data/spells/icons2d',
    'plugins/rcp-be-lol-game-data/global/default/v1/champion-icons',
    'plugins/rcp-be-lol-game-data/global/default/v1/summoner-spells.json',
    'plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json',
    'plugins/rcp-be-lol-game-data/global/default/v1/items.json',
    'plugins/rcp-be-lol-game-data/global/default/v1/maps.json',
    'plugins/rcp-be-lol-game-data/global/default/v1/queues.json',
    'plugins/rcp-be-lol-game-data/global/default/v1/champions',
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
    try {
      const { data } = await axios.get(url);
      return data
        .split('\n')
        .map((line: string) => line.trim())
        .filter(Boolean);
    } catch (error) {
      console.error('Error at download list:', error);
      return [];
    }
  }

  private filterUrls(
    urls: string[],
    regexList: string[],
    isRemove = false,
  ): string[] {
    if (!regexList.length) return urls;
    return urls.filter((url) =>
      regexList.some((regS) => {
        const regex = new RegExp(regS);
        if (isRemove) return !regex.test(url);
        return regex.test(url);
      }),
    );
  }

  private async downloadFile(url: string, outputDir: string) {
    try {
      const fileName = path.basename(url);
      const outputPath = path.join(outputDir, fileName);

      /*
      if (await fs.pathExists(outputPath)) {
        this.logger.info(`File already exist, ignoring: ${fileName}`);
        return;
      }

       */

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
          this.sendMsgToRender('onLoadGameData', {
            status: 'downloading',
            info: {
              currentPercent,
              currentFileDownloading: url,
            },
          });
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
    const filterAllow: string[] = this.FILE_LIST_TO_DOWNLOAD;
    const filterDeny: string[] = [];
    const urls = await this.fetchFileList(
      this.COMMUNITY_DRAGON_FILES_EXPORTED.replace('{version}', version),
    );

    Object.keys(translateJsonMap).forEach((k) => {
      filterAllow.push(`plugins/${k}/global/default/trans(.*)json`);
    });

    const filteredUrls = this.filterUrls(
      this.filterUrls(urls, filterAllow),
      filterDeny,
      true,
    );
    const output = this.getLolGameDataResourcePath(version);
    await fs.ensureDir(output);
    await this.downloadInBatches(filteredUrls, version, 250, output);

    await this.leagueClientDataReaderService.readGameData(info);
  }
}
