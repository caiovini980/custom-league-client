import { IpcHandle } from '@main/ipc';
import { GameDataService } from '@main/modules/game-data/game-data.service';
import { Controller } from '@nestjs/common';
import { LoadGameDataResponse } from '@shared/typings/ipc-function/handle/game-data.typing';

@Controller('gameData')
export class GameDataController {
  constructor(private gameDataService: GameDataService) {}

  @IpcHandle('loadGameData')
  async loadGameData(): Promise<LoadGameDataResponse> {
    return this.gameDataService.loadGameData();
  }
}
