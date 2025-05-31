import * as path from 'node:path';
import { ServiceAbstract } from '@main/abstract/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { ClientStatusConnected } from '@shared/typings/ipc-function/to-renderer/client-status.typing';
import { LoadGameDataComplete } from '@shared/typings/ipc-function/to-renderer/load-game-data.typing';
import { Champion } from '@shared/typings/lol/json/champion';
import { ChampionSummary } from '@shared/typings/lol/json/champion-summary';
import { Item } from '@shared/typings/lol/json/item';
import { Map } from '@shared/typings/lol/json/map';
import { Queue } from '@shared/typings/lol/json/queue';
import { SummonerSpells } from '@shared/typings/lol/json/summoner-spells';
import { translateJsonMap } from '@shared/utils/translate.util';
import fs from 'fs-extra';
import { Perk } from '@shared/typings/lol/json/perk';
import { PerkStyles } from '@shared/typings/lol/json/perkStyles';
import { LeagueClientService } from '@main/integrations/league-client/league-client.service';

@Service()
export class LeagueClientDataReaderService extends ServiceAbstract {
  private resourcePath = '';

  constructor(private leagueClientService: LeagueClientService) {
    super();
  }

  async readGameData(info: ClientStatusConnected['info']) {
    this.logger.info('Reading game data');
    this.sendMsgToRender('onLoadGameData', {
      status: 'reading',
      info: null,
    });
    this.resourcePath = this.getLolGameDataResourcePath(info.version);

    this.sendMsgToRender('onLoadGameData', {
      status: 'complete',
      info: {
        champions: await this.readChampionData(),
        spells: await this.readSpellData(),
        items: await this.readItemData(),
        maps: await this.readMapData(),
        queues: await this.readQueueData(),
        perks: await this.readPerksData(),
        perkStyles: await this.readPerkStylesData(),
        translate: this.translate(),
      },
    });
    this.logger.info('Read complete');
  }

  private async readPerksData() {
    const perksString = await this.readFileFromLolGameData('v1/perks.json');
    return JSON.parse(perksString) as Perk[];
  }

  private async readPerkStylesData() {
    const perkStylesString =
      await this.readFileFromLolGameData('v1/perkstyles.json');
    return JSON.parse(perkStylesString).styles as PerkStyles[];
  }

  private async readChampionData() {
    const championSummaryString = await this.readFileFromLolGameData(
      'v1/champion-summary.json',
    );

    const championSummaryList = JSON.parse(
      championSummaryString,
    ) as ChampionSummary[];

    const champions: Champion[] = [];

    for (const c of championSummaryList) {
      const championString = await this.readFileFromLolGameData(
        `v1/champions/${c.id}.json`,
      );
      champions.push(JSON.parse(championString) as Champion);
    }

    return champions;
  }

  private async readSpellData() {
    const summonerSpellString = await this.readFileFromLolGameData(
      'v1/summoner-spells.json',
    );
    return JSON.parse(summonerSpellString) as SummonerSpells[];
  }

  private async readItemData() {
    const itemString = await this.readFileFromLolGameData('v1/items.json');
    return JSON.parse(itemString) as Item[];
  }

  private async readMapData() {
    const mapString = await this.readFileFromLolGameData('v1/maps.json');
    return JSON.parse(mapString) as Map[];
  }

  private async readQueueData() {
    const queueString = await this.readFileFromLolGameData('v1/queues.json');
    return JSON.parse(queueString) as Queue[];
  }

  private translate() {
    return Object.keys(translateJsonMap).reduce(
      (prev, curr) => {
        return Object.assign(prev, {
          [curr]: this.translatePath(curr, translateJsonMap[curr]),
        });
      },
      {} as LoadGameDataComplete['info']['translate'],
    );
  }

  private translatePath(tPath: string, keys: string[]) {
    try {
      const translateFile = (filename: string) => {
        const p = path.join(
          `plugins/${tPath}/global/default`,
          `${filename}.json`,
        );
        return JSON.parse(this.readFileDownloaded(p)) as Record<string, string>;
      };
      return keys.reduce((prev, curr) => {
        return Object.assign(prev, {
          [curr]: translateFile(curr),
        });
      }, {});
    } catch (e) {
      this.logger.error(`Error on read ${tPath}: ${e}`);
      throw e;
    }
  }

  private async readFileFromLolGameData(filePath: string) {
    const res = await this.leagueClientService.rawHandleEndpoint(
      'GET',
      `/lol-game-data/assets/${filePath}`,
      undefined,
    );
    if (res.ok) {
      const fileString = res.text();
      // REMOVE BOM
      if (fileString.charCodeAt(0) === 0xfeff) {
        return fileString.slice(1);
      }
      return fileString;
    }
    throw new Error(`Cannot getting: ${filePath}`);
  }

  private readFileDownloaded(filePath: string) {
    const s = fs.readFileSync(path.join(this.resourcePath, filePath), {
      encoding: 'utf8',
    });
    // REMOVE BOM
    if (s.charCodeAt(0) === 0xfeff) {
      return s.slice(1);
    }
    return s;
  }
}
