import { EqualityChecker, StoreApi, store } from '@davstack/store';
import { Undefined } from '@shared/typings/generic.typing';
import { LolChampSelectV1OngoingChampionSwap } from '@shared/typings/lol/response/lolChampSelectV1OngoingChampionSwap';
import { LolChampSelectV1OngoingPickOrderSwap } from '@shared/typings/lol/response/lolChampSelectV1OngoingPickOrderSwap';
import { LolChampSelectV1OngoingPositionSwap } from '@shared/typings/lol/response/lolChampSelectV1OngoingPositionSwap';
import { LolChampSelectV1Session } from '@shared/typings/lol/response/lolChampSelectV1Session';
import { LolChampSelectV1Summoners_Id } from '@shared/typings/lol/response/lolChampSelectV1Summoners_Id';
import { shallow } from 'zustand/shallow';

export type ChampSelectionActions =
  | 'planning'
  | 'ban'
  | 'show-bans'
  | 'pick'
  | 'pick-done'
  | 'finalization'
  | 'my-team-pick'
  | 'enemy-team-pick';

export type SwapType =
  | LolChampSelectV1OngoingPickOrderSwap
  | LolChampSelectV1OngoingPositionSwap
  | LolChampSelectV1OngoingChampionSwap;

export interface ChampSelectState {
  gameMode: string;
  session: LolChampSelectV1Session;
  legacySession: LolChampSelectV1Session;
  summoners: Record<number, LolChampSelectV1Summoners_Id>;
  swapData: Record<number, SwapType>;
  summonerName: Record<string, string>;
}

const initialState: ChampSelectState = {
  gameMode: '',
  session: {} as LolChampSelectV1Session,
  legacySession: {} as LolChampSelectV1Session,
  summoners: {},
  swapData: {},
  summonerName: {},
};

export const champSelectStore = store(initialState, {
  name: 'champSelect',
  devtools: { enabled: true },
})
  .actions((store) => ({
    resetState: () => store.set(initialState),
    setSwapData: (data: SwapType) => {
      store.swapData.assign({
        [data.otherSummonerIndex]: data,
      });
    },
    removeSwapData: (slotId: number) => {
      const data = { ...store.swapData.get() };
      delete data[slotId];
      store.swapData.set(data);
    },
  }))
  .computed((store) => ({
    hasSession: () => store.session.use((s) => !!Object.keys(s).length),
    isLegacy: () =>
      store.use(
        (s) =>
          s.session.isLegacyChampSelect &&
          !!Object.keys(s.legacySession).length,
      ),
    cellId: () => resolveSession(store, (session) => session.localPlayerCellId),
    slotId: (): number => resolveSession(store, getSlotId),
    summonerDataBySlotId: (
      slotId: number,
    ): Undefined<LolChampSelectV1Summoners_Id> =>
      store.summoners.use((s) => s[slotId], shallow),
    sessionActions: () => resolveSession(store, (session) => session.actions),
    currentActionIndex: () =>
      resolveSession(store, (session) => {
        return session.actions.findIndex((al) => al.some((a) => !a.completed));
      }),
    currentPlayerAction: () =>
      resolveSession(store, (session) => {
        return session.actions
          .flat()
          .find(
            (a) => a.actorCellId === session.localPlayerCellId && !a.completed,
          );
      }),
    currentBanActionId: () =>
      resolveSession(store, (session) => {
        return (
          session.actions
            .flat()
            .find(
              (a) =>
                a.actorCellId === session.localPlayerCellId &&
                !a.completed &&
                a.type === 'ban',
            )?.id ?? -1
        );
      }),
    currentPickActionId: () =>
      resolveSession(store, (session) => {
        return (
          session.actions
            .flat()
            .find(
              (a) =>
                a.actorCellId === session.localPlayerCellId &&
                !a.completed &&
                a.type === 'pick',
            )?.id ?? -1
        );
      }),
    aram: () =>
      resolveSession(
        store,
        (session) => {
          return {
            benchEnabled: session.benchEnabled,
            benchChampions: session.benchChampions,
          };
        },
        shallow,
      ),
    bans: () =>
      resolveSession(
        store,
        (session) => {
          const actionBans = session.actions
            .flat()
            .filter((a) => a.type === 'ban');
          const myTeam: number[] = [];
          const theirTeam: number[] = [];

          actionBans.forEach((a) => {
            if (a.isAllyAction) {
              myTeam.push(a.championId);
            } else {
              theirTeam.push(a.championId);
            }
          });

          return {
            banIntentChampionId: getCurrentSummoner(
              store,
              (s) => s.banIntentChampionId,
              0,
            ),
            myTeam,
            theirTeam,
          };
        },
        shallow,
      ),
    disabledChampions: () =>
      resolveSession(
        store,
        (session) => {
          return session.actions
            .flat()
            .filter((a) => a.type === 'ban' && a.championId > 0 && a.completed)
            .map((a) => a.championId);
        },
        shallow,
      ),
    amountPlayer: () =>
      resolveSession(store, (session) => {
        return session.myTeam.length + session.theirTeam.length;
      }),
    spells: () =>
      resolveSession(store, (session) => {
        const s = session.myTeam.find(
          (t) => t.cellId === session.localPlayerCellId,
        );
        return {
          spell1Id: s?.spell1Id ?? -1,
          spell2Id: s?.spell2Id ?? -2,
        };
      }),
    currentAction: (): ChampSelectionActions =>
      resolveSession(store, (session) => {
        const cellId = session.localPlayerCellId;
        const timerPhase = session.timer.phase;
        const areSummonerActionsComplete = getCurrentSummoner(
          store,
          (s) => s.areSummonerActionsComplete,
          false,
        );
        const actionsInProgress = session.actions
          .flat()
          .filter((a) => !a.completed && a.isInProgress);

        if (timerPhase === 'PLANNING') {
          return 'planning';
        }

        if (timerPhase === 'FINALIZATION') {
          return 'finalization';
        }

        if (areSummonerActionsComplete) {
          return 'pick-done';
        }

        if (!actionsInProgress.length) {
          return 'finalization';
        }

        const { type, isAllyAction } = actionsInProgress[0];

        if (type === 'ten_bans_reveal') {
          return 'show-bans';
        }

        if (type === 'ban') {
          return 'ban';
        }

        if (type === 'pick') {
          if (!isAllyAction) return 'enemy-team-pick';
          if (actionsInProgress.some((a) => a.actorCellId === cellId)) {
            return 'pick';
          }
          return 'my-team-pick';
        }

        return 'finalization';
      }),
  }))
  .extend((store) => ({
    getSessionData: <T>(
      fn: (session: LolChampSelectV1Session) => T,
      equalityFn?: EqualityChecker<ChampSelectState>,
    ) => resolveSession(store, fn, equalityFn),
    getCurrentSummonerData: <T>(
      fn: (summoner: LolChampSelectV1Summoners_Id) => T,
      defaultValue: T,
    ) => getCurrentSummoner(store, fn, defaultValue),
  }));

const getSlotId = (session: LolChampSelectV1Session) => {
  return session.myTeam.findIndex(
    (t) => t.cellId === session.localPlayerCellId,
  );
};

const getCurrentSummoner = <T>(
  store: StoreApi<ChampSelectState>,
  fn: (summoner: LolChampSelectV1Summoners_Id) => T,
  defaultValue: T,
) => {
  const slotId = resolveSession(store, getSlotId);
  return store.summoners.use((s) => {
    const summoner = s[slotId];
    if (summoner) return fn(summoner);
    return defaultValue;
  }, shallow);
};

const resolveSession = <T>(
  store: StoreApi<ChampSelectState>,
  fn: (session: LolChampSelectV1Session) => T,
  equalityFn?: EqualityChecker<ChampSelectState>,
) => {
  return store.use((s) => {
    if (Object.keys(s.legacySession).length) return fn(s.legacySession);
    return fn(s.session);
  }, equalityFn);
};
