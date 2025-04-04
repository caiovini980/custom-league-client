import * as path from 'node:path';
import { ServiceAbstract } from '@main/abstract/service.abstract';
import { Service } from '@main/decorators/service.decorator';
import { ClientStatusConnected } from '@shared/typings/ipc-function/to-renderer/client-status.typing';
import { Champion } from '@shared/typings/lol/json/champion';
import { ChampionSummary } from '@shared/typings/lol/json/champion-summary';
import { Item } from '@shared/typings/lol/json/item';
import { SummonerSpells } from '@shared/typings/lol/json/summoner-spells';
import fs from 'fs-extra';

@Service()
export class LeagueClientDataReaderService extends ServiceAbstract {
  async readGameData(
    _info: ClientStatusConnected['info'],
    resourcePath: string,
  ) {
    this.logger.info('Reading game data');
    this.sendMsgToRender('onLoadGameData', {
      status: 'reading',
      info: null,
    });

    const summonerSpellFile =
      'plugins/rcp-be-lol-game-data/global/default/v1/summoner-spells.json';
    const championSummaryFile =
      'plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json';
    const itemFile =
      'plugins/rcp-be-lol-game-data/global/default/v1/items.json';

    const summonerSpellString = this.readFile(resourcePath, summonerSpellFile);
    const championSummaryString = this.readFile(
      resourcePath,
      championSummaryFile,
    );
    const itemString = this.readFile(resourcePath, itemFile);

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
    return {
      summonerSpell: JSON.parse(summonerSpellString) as SummonerSpells[],
      championSummary: championDataList,
      items: JSON.parse(itemString) as Item[],
    };
  }

  private readFile(resourcePath: string, filePath: string) {
    return fs.readFileSync(path.join(resourcePath, filePath), {
      encoding: 'utf-8',
    });
  }
}
