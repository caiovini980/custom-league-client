import * as path from 'node:path';
import { ServiceAbstract } from '@main/abstract/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { ClientStatusConnected } from '@shared/typings/ipc-function/to-renderer/client-status.typing';
import { Champion } from '@shared/typings/lol/json/champion';
import { ChampionSummary } from '@shared/typings/lol/json/champion-summary';
import { Item } from '@shared/typings/lol/json/item';
import { Map } from '@shared/typings/lol/json/map';
import { Queue } from '@shared/typings/lol/json/queue';
import { SummonerSpells } from '@shared/typings/lol/json/summoner-spells';
import fs from 'fs-extra';

@Service()
export class LeagueClientDataReaderService extends ServiceAbstract {
  async readGameData(info: ClientStatusConnected['info']) {
    this.logger.info('Reading game data');
    this.sendMsgToRender('onLoadGameData', {
      status: 'reading',
      info: null,
    });
    const resourcePath = this.getLolGameDataResourcePath(info.version);
    const summonerSpellString = this.readFile(
      resourcePath,
      'plugins/rcp-be-lol-game-data/global/default/v1/summoner-spells.json',
    );
    const championSummaryString = this.readFile(
      resourcePath,
      'plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json',
    );
    const itemString = this.readFile(
      resourcePath,
      'plugins/rcp-be-lol-game-data/global/default/v1/items.json',
    );
    const mapString = this.readFile(
      resourcePath,
      'plugins/rcp-be-lol-game-data/global/default/v1/maps.json',
    );
    const queueString = this.readFile(
      resourcePath,
      'plugins/rcp-be-lol-game-data/global/default/v1/queues.json',
    );

    this.logger.info('Read complete');

    const championSummaryList = JSON.parse(
      championSummaryString,
    ) as ChampionSummary[];
    const championDataList = championSummaryList.map((c) => {
      const championString = this.readFile(
        resourcePath,
        `plugins/rcp-be-lol-game-data/global/default/v1/champions/${c.id}.json`,
      );
      return JSON.parse(championString) as Champion;
    });

    this.sendMsgToRender('onLoadGameData', {
      status: 'complete',
      info: {
        champions: championDataList,
        spells: JSON.parse(summonerSpellString) as SummonerSpells[],
        items: JSON.parse(itemString) as Item[],
        maps: JSON.parse(mapString) as Map[],
        queues: JSON.parse(queueString) as Queue[],
      },
    });
  }

  private readFile(resourcePath: string, filePath: string) {
    return fs.readFileSync(path.join(resourcePath, filePath), {
      encoding: 'utf-8',
    });
  }
}
