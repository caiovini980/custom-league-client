import { useAudio, useAudioManager } from '@render/hooks/useAudioManager';
import { ChampSelectionActions } from '@render/hooks/useChampSelect';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { LolChampSelectV1Session } from '@shared/typings/lol/response/lolChampSelectV1Session';
import { LolChampSelectV1Summoners_Id } from '@shared/typings/lol/response/lolChampSelectV1Summoners_Id';
import { useEffect, useRef } from 'react';

interface ChampSelectAudioProps {
  session: LolChampSelectV1Session;
  time: number;
  action: ChampSelectionActions;
  summonerData: LolChampSelectV1Summoners_Id | undefined;
  summonersData: Record<number, LolChampSelectV1Summoners_Id>;
}

export const ChampSelectAudio = ({
  action,
  summonerData,
  summonersData,
  time,
}: ChampSelectAudioProps) => {
  const { playOnce } = useAudioManager();

  const musicChampSelect = useAudio('music-cs-blindpick-default');
  const musicAramChampSelect = useAudio('music-cs-allrandom-howlingabyss');
  const musicDraftFinalization = useAudio('music-cs-draft-finalization-01');

  const lobby = lobbyStore.lobby.use();

  const summonersChampionPicked = useRef<Record<number, boolean>>({});

  useEffect(() => {
    Object.keys(summonersData)
      .filter((cellId) => !summonersChampionPicked.current[cellId])
      .forEach((cellId) => {
        const summoner = summonersData[cellId] as LolChampSelectV1Summoners_Id;
        if (summoner.championId !== 0 && summoner.areSummonerActionsComplete) {
          playOnce('sfx-cs-draft-right-pick-single');
          summonersChampionPicked.current[cellId] = true;
        }
      });

    const isFinished = Object.values(summonersData).every(
      (summoner) => summoner.areSummonerActionsComplete,
    );

    if (isFinished) {
      musicChampSelect.stop();
      musicAramChampSelect.stop();
      musicDraftFinalization.play(false);
    }
  }, [summonersData]);

  useEffect(() => {
    if (summonerData?.isActingNow) {
      playOnce(
        action === 'ban'
          ? 'sfx-cs-draft-notif-yourban'
          : 'sfx-cs-draft-notif-yourpick',
      );
    }
  }, [summonerData?.isActingNow]);

  useEffect(() => {
    if (action === 'pick') {
      playOnce('sfx-cs-draft-pick-intro');
    }
    if (action === 'ban') {
      playOnce('sfx-cs-draft-10ban-intro');
    }
  }, [action]);

  useEffect(() => {
    if (lobby?.gameConfig.gameMode === 'ARAM') {
      musicAramChampSelect.play(false);
    } else {
      musicChampSelect.play(false);
    }

    return () => {
      musicChampSelect.stop();
      musicAramChampSelect.stop();
    };
  }, [lobby?.gameConfig.gameMode]);

  useEffect(() => {
    if (time <= 10) {
      playOnce(
        summonerData?.isActingNow
          ? 'sfx-cs-timer-tick'
          : 'sfx-cs-timer-tick-small',
      );
    }
  }, [summonerData?.isActingNow, time]);

  return <></>;
};
