import { useAudio } from '@render/hooks/useAudioManager';
import {
  ChampSelectionActions,
  champSelectStore,
} from '@render/zustand/stores/champSelectStore';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { LolChampSelectV1Summoners_Id } from '@shared/typings/lol/response/lolChampSelectV1Summoners_Id';
import { useEffect, useRef } from 'react';

interface ChampSelectAudioProps {
  time: number;
  action: ChampSelectionActions;
  isActingNow: boolean;
}

export const ChampSelectAudio = ({
  action,
  isActingNow,
  time,
}: ChampSelectAudioProps) => {
  const sfxDraft = useAudio('sfx-cs-draft-right-pick-single');
  const sfxDraftBan = useAudio('sfx-cs-draft-notif-yourban');
  const sfxDraftPick = useAudio('sfx-cs-draft-notif-yourpick');
  const sfxTimerTick = useAudio('sfx-cs-timer-tick');
  const sfxTimerTickSmall = useAudio('sfx-cs-timer-tick-small');
  const sfxDraftIntro = useAudio('sfx-cs-draft-pick-intro');
  const sfxBanIntro = useAudio('sfx-cs-draft-10ban-intro');

  const musicChampSelect = useAudio('music-cs-blindpick-default');
  const musicAramChampSelect = useAudio('music-cs-allrandom-howlingabyss');
  const musicDraftFinalization = useAudio('music-cs-draft-finalization-01');

  const summonersData = champSelectStore.summoners.use();
  const lobbyGameMode = lobbyStore.lobby.use((s) => s?.gameConfig.gameMode);
  const gameFlowPhase = lobbyStore.gameFlow.use((s) => s?.phase ?? 'None');

  const summonersChampionPicked = useRef<Record<number, boolean>>({});

  const stopAll = () => {
    musicChampSelect.stop();
    musicAramChampSelect.stop();
    musicDraftFinalization.stop();
  };

  useEffect(() => {
    Object.keys(summonersData)
      .filter((cellId) => !summonersChampionPicked.current[cellId])
      .forEach((cellId) => {
        const summoner = summonersData[cellId] as LolChampSelectV1Summoners_Id;
        if (summoner.championId !== 0 && summoner.areSummonerActionsComplete) {
          sfxDraft.play();
          summonersChampionPicked.current[cellId] = true;
        }
      });
  }, [summonersData]);

  useEffect(() => {
    if (isActingNow) {
      if (action === 'ban') {
        sfxDraftBan.play();
      } else {
        sfxDraftPick.play();
      }
    }
  }, [isActingNow]);

  useEffect(() => {
    if (action === 'pick') {
      sfxDraftIntro.play();
    }
    if (action === 'ban') {
      sfxBanIntro.play();
    }
  }, [action]);

  useEffect(() => {
    if (!lobbyGameMode) return;
    if (lobbyGameMode === 'ARAM') {
      musicAramChampSelect.play();
    } else {
      musicChampSelect.play();
    }
  }, [lobbyGameMode]);

  useEffect(() => {
    if (time <= 10) {
      if (isActingNow) {
        sfxTimerTick.replay();
      } else if (action === 'finalization') {
        sfxTimerTickSmall.replay();
      }
    }
    if (time <= 30 && action === 'finalization') {
      musicChampSelect.stop();
      musicAramChampSelect.stop();
      musicDraftFinalization.play();
    }
  }, [time]);

  useEffect(() => {
    if (gameFlowPhase !== 'ChampSelect') {
      stopAll();
    }
  }, [gameFlowPhase]);

  return null;
};
