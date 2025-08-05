import { store } from '@davstack/store';
import { LoadGameDataComplete } from '@shared/typings/ipc-function/to-renderer/load-game-data.typing';

export type GameDataState = {
  loaded: boolean;
} & LoadGameDataComplete['info'];

const initialState: GameDataState = {
  loaded: false,
  champions: [],
  spells: [],
  items: [],
  maps: [],
  queues: [],
  perks: [],
  perkStyles: [],
  translate: {} as GameDataState['translate'],
};

export const gameDataStore = store(initialState, {
  name: 'gameData',
  devtools: { enabled: true },
})
  .actions((store) => ({
    setGameData: (value: GameDataState) => {
      store.set(value);
    },
  }))
  .computed((store) => ({
    queueNameById: (queueId: number) =>
      store.queues.use((queues) => {
        return queues.find((q) => q.id === queueId)?.name ?? '';
      }),
    mapById: (mapId: number) =>
      store.maps.use((maps) => maps.find((m) => m.id === mapId)),
  }));
