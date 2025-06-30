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

@Service()
export class LeagueClientDataReaderService extends ServiceAbstract {
  private resourcePath = '';

  async readGameData(info: ClientStatusConnected['info']) {
    this.logger.info('Reading game data');
    this.sendMsgToRender('onLoadGameData', {
      status: 'reading',
      info: null,
    });
    this.resourcePath = this.getResourcePath();

    this.sendMsgToRender('onLoadGameData', {
      status: 'complete',
      info: {
        champions: this.readChampionData(info.locale),
        spells: this.readSpellData(info.locale),
        items: this.readItemData(info.locale),
        maps: this.readMapData(info.locale),
        queues: this.readQueueData(info.locale),
        perks: this.readPerksData(info.locale),
        perkStyles: this.readPerkStylesData(info.locale),
        translate: this.translate(info.locale),
      },
    });
    this.logger.info('Read complete');
  }

  private readPerksData(locale: string) {
    const perksString = this.readFileDownloaded(
      `plugins/rcp-be-lol-game-data/global/${locale}/v1/perks.json`,
    );
    return JSON.parse(perksString) as Perk[];
  }

  private readPerkStylesData(locale: string) {
    const perkStylesString = this.readFileDownloaded(
      `plugins/rcp-be-lol-game-data/global/${locale}/v1/perkstyles.json`,
    );
    return JSON.parse(perkStylesString).styles as PerkStyles[];
  }

  private readChampionData(locale: string) {
    const championSummaryString = this.readFileDownloaded(
      `plugins/rcp-be-lol-game-data/global/${locale}/v1/champion-summary.json`,
    );

    const championSummaryList = JSON.parse(
      championSummaryString,
    ) as ChampionSummary[];

    const champions: Champion[] = [];

    for (const c of championSummaryList) {
      const championString = this.readFileDownloaded(
        `plugins/rcp-be-lol-game-data/global/${locale}/v1/champions/${c.id}.json`,
      );
      champions.push(JSON.parse(championString) as Champion);
    }

    return champions;
  }

  private readSpellData(locale: string) {
    const summonerSpellString = this.readFileDownloaded(
      `plugins/rcp-be-lol-game-data/global/${locale}/v1/summoner-spells.json`,
    );
    return JSON.parse(summonerSpellString) as SummonerSpells[];
  }

  private readItemData(locale: string) {
    const itemString = this.readFileDownloaded(
      `plugins/rcp-be-lol-game-data/global/${locale}/v1/items.json`,
    );
    return JSON.parse(itemString) as Item[];
  }

  private readMapData(locale: string) {
    const mapString = this.readFileDownloaded(
      `plugins/rcp-be-lol-game-data/global/${locale}/v1/maps.json`,
    );
    return JSON.parse(mapString) as Map[];
  }

  private readQueueData(locale: string) {
    const queueString = this.readFileDownloaded(
      `plugins/rcp-be-lol-game-data/global/${locale}/v1/queues.json`,
    );
    return JSON.parse(queueString) as Queue[];
  }

  private translate(locale: string) {
    return Object.keys(translateJsonMap).reduce(
      (prev, curr) => {
        return Object.assign(prev, {
          [curr]: this.translatePath(locale, curr, translateJsonMap[curr]),
        });
      },
      {} as LoadGameDataComplete['info']['translate'],
    );
  }

  private translatePath(locale: string, tPath: string, keys: string[]) {
    try {
      const translateFile = (filename: string) => {
        const p = path.join(
          `plugins/${tPath}/global/${locale.toLowerCase()}`,
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
