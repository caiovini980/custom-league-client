import * as path from 'node:path';
import { ServiceAbstract } from '@main/abstract/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { LeagueClientService } from '@main/integrations/league-client/league-client.service';
import { ChampionGameDataEntity } from '@main/modules/game-data/entities/champion-game-data.entity';
import { GameDataInfoEntity } from '@main/modules/game-data/entities/game-data-info.entity';
import { ChampionGameDataRepository } from '@main/modules/game-data/repositories/champion-game-data.repository';
import { GameDataInfoRepository } from '@main/modules/game-data/repositories/game-data-info.repository';
import { LoadGameDataChampionDataResponse } from '@shared/typings/ipc-function/handle/game-data.typing';
import { ChampionDataDragon } from '@shared/typings/lol/data-dragon/all-champions';
import { Realms } from '@shared/typings/lol/data-dragon/realms';
import { SingleChampionDataDragon } from '@shared/typings/lol/data-dragon/single-champion';
import { RiotClientRegionLocale } from '@shared/typings/lol/response/riotClientRegionLocale';
import { SystemV1Builds } from '@shared/typings/lol/response/systemV1Builds';
import axios from 'axios';
import { app } from 'electron';
import fs from 'fs-extra';
import { Transactional } from 'typeorm-transactional';

@Service()
export class GameDataService extends ServiceAbstract {
  private COMMUNITY_DRAGON_FILES_EXPORTED =
    'https://raw.communitydragon.org/latest/cdragon/files.exported.txt';
  private DATA_DRAGON_URL = 'https://ddragon.leagueoflegends.com';

  constructor(
    private leagueClientService: LeagueClientService,
    private championGameDataRepository: ChampionGameDataRepository,
    private gameDataInfoRepository: GameDataInfoRepository,
  ) {
    super();
  }

  @Transactional()
  async loadGameData() {
    this.logger.info('Loading game data');
    const { data: regionData } = await this.getRegionData();
    const version = regionData.v;
    const language = regionData.l;

    let info = await this.gameDataInfoRepository.findOneBy({
      version,
      language,
    });

    if (!info) {
      info = new GameDataInfoEntity();
      info.language = language;
      info.version = version;
      info.data = '[]';
    }

    const gameDataInfo = JSON.parse(info.data) as string[];

    if (!gameDataInfo.includes('champion')) {
      await this.loadChampionData(version, language);
      gameDataInfo.push('champion');
    }

    info.data = JSON.stringify(gameDataInfo);

    await this.gameDataInfoRepository.save(info);

    return {
      version,
      language,
      championData: await this.getChampionData(version, language),
    };
  }

  private async loadChampionData(version: string, language: string) {
    this.logger.info('Loading champion game data');
    await this.championGameDataRepository.delete({
      language,
      version,
    });

    const { data: championsData } = await axios<ChampionDataDragon>({
      method: 'GET',
      url: `${this.DATA_DRAGON_URL}/cdn/${version}/data/${language}/champion.json`,
    });

    const championEntityList: ChampionGameDataEntity[] = [];

    for (const key of Object.keys(championsData.data)) {
      this.logger.info(`Getting ${key} info...`);
      const { data: championData } = await axios<SingleChampionDataDragon>({
        method: 'GET',
        url: `${this.DATA_DRAGON_URL}/cdn/${version}/data/${language}/champion/${key}.json`,
      });

      const entity = new ChampionGameDataEntity();
      const champion = championData.data[key];
      entity.version = version;
      entity.language = language;
      entity.championId = champion.id;
      entity.championKey = champion.key;
      entity.data = JSON.stringify(champion);

      championEntityList.push(entity);
    }

    await this.championGameDataRepository.save(championEntityList);
  }

  async getVersion() {
    this.logger.info('Get version');
    const regionData = await this.getRegionData();

    return regionData.data.dd as string;
  }

  async getRegionData() {
    const regionLocale =
      await this.leagueClientService.handleEndpoint<RiotClientRegionLocale>(
        'GET',
        '/riotclient/region-locale',
        undefined,
      );
    if (!regionLocale.ok) {
      throw new Error('Region error');
    }

    return axios<Realms>({
      method: 'GET',
      url: `${this.DATA_DRAGON_URL}/realms/${regionLocale.body?.webRegion}.json`,
    });
  }

  private async getChampionData(version: string, language: string) {
    const champions = await this.championGameDataRepository.findBy({
      version,
      language,
    });

    return champions.reduce((prev, curr) => {
      prev.push({
        id: curr.championId,
        key: curr.championKey,
      });
      return prev;
    }, [] as LoadGameDataChampionDataResponse[]);
  }

  async fetchFileList(url: string): Promise<string[]> {
    try {
      const { data } = await axios.get(url);
      return data
        .split('\n')
        .map((line: string) => line.trim())
        .filter(Boolean);
    } catch (error) {
      console.error('Erro ao baixar lista:', error);
      return [];
    }
  }

  private filterUrls(
    urls: string[],
    regexList: RegExp[],
    isRemove = false,
  ): string[] {
    return urls.filter((url) =>
      regexList.some((regex) => {
        if (isRemove) return !regex.test(url);
        return regex.test(url);
      }),
    );
  }

  async downloadFile(url: string, outputDir: string) {
    try {
      const fileName = path.basename(url);
      const outputPath = path.join(outputDir, fileName);

      const { data } = await axios.get(url, { responseType: 'arraybuffer' });
      await fs.outputFile(outputPath, data);

      console.log(`Baixado: ${fileName}`);
    } catch (error) {
      console.error(`Erro ao baixar ${url}:`, error);
    }
  }

  // @ts-ignore
  private async loadFromCommunityDragon() {
    // Read this file (https://raw.communitydragon.org/latest/cdragon/files.exported.txt)
    // And download contents

    const systemBuild =
      await this.leagueClientService.handleEndpoint<SystemV1Builds>(
        'GET',
        '/system/v1/builds',
        undefined,
      );

    const regionLocale =
      await this.leagueClientService.handleEndpoint<RiotClientRegionLocale>(
        'GET',
        '/riotclient/region-locale',
        undefined,
      );

    const version = systemBuild.body.version.substring(0, 4);

    const filterAllow = [
      /plugins\/rcp-be-lol-game-data\/global\/default\/assets\/characters/,
      new RegExp(
        `plugins/rcp-be-lol-game-data/global/${regionLocale.body.locale.toLowerCase()}/v1/champions`,
      ),
    ];
    const filterDeny = [
      /plugins\/rcp-be-lol-game-data\/global\/default\/assets\/characters\/tft.*/,
    ];
    const urls = await this.fetchFileList(
      this.COMMUNITY_DRAGON_FILES_EXPORTED.replace('latest', version),
    );
    const filteredUrls = this.filterUrls(
      this.filterUrls(urls, filterAllow),
      filterDeny,
      true,
    );
    const output = path.join(app.getPath('userData'), 'Resources', version);
    console.log(output);
    await fs.ensureDir(output);
    for (const url of filteredUrls) {
      await this.downloadFile(
        `https://raw.communitydragon.org/${version}/${url}`,
        path.join(output, path.dirname(url)),
      );
    }
  }
}
