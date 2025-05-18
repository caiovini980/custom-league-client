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
    this.resourcePath = this.getLolGameDataResourcePath(info.version);

    this.sendMsgToRender('onLoadGameData', {
      status: 'complete',
      info: {
        champions: this.readChampionData(),
        spells: this.readSpellData(),
        items: this.readItemData(),
        maps: this.readMapData(),
        queues: this.readQueueData(),
        perks: this.readPerksData(),
        perkStyles: this.readPerkStylesData(),
        translate: this.translate(),
      },
    });
    this.logger.info('Read complete');
  }

  private readPerksData() {
    const perksString = this.readFile(
      'plugins/rcp-be-lol-game-data/global/default/v1/perks.json',
    );
    return JSON.parse(perksString) as Perk[];
  }

  private readPerkStylesData() {
    const perkStylesString = this.readFile(
      'plugins/rcp-be-lol-game-data/global/default/v1/perkstyles.json',
    );
    return JSON.parse(perkStylesString).styles as PerkStyles[];
  }

  private readChampionData() {
    const championSummaryString = this.readFile(
      'plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json',
    );

    const championSummaryList = JSON.parse(
      championSummaryString,
    ) as ChampionSummary[];
    return championSummaryList.map((c) => {
      const championString = this.readFile(
        `plugins/rcp-be-lol-game-data/global/default/v1/champions/${c.id}.json`,
      );
      return JSON.parse(championString) as Champion;
    });
  }

  private readSpellData() {
    const summonerSpellString = this.readFile(
      'plugins/rcp-be-lol-game-data/global/default/v1/summoner-spells.json',
    );
    return JSON.parse(summonerSpellString) as SummonerSpells[];
  }

  private readItemData() {
    const itemString = this.readFile(
      'plugins/rcp-be-lol-game-data/global/default/v1/items.json',
    );
    return JSON.parse(itemString) as Item[];
  }

  private readMapData() {
    const mapString = this.readFile(
      'plugins/rcp-be-lol-game-data/global/default/v1/maps.json',
    );
    return JSON.parse(mapString) as Map[];
  }

  private readQueueData() {
    const queueString = this.readFile(
      'plugins/rcp-be-lol-game-data/global/default/v1/queues.json',
    );
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
        return JSON.parse(this.readFile(p)) as Record<string, string>;
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

  private readFile(filePath: string) {
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
