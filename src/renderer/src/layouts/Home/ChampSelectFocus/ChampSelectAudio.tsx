import { useAudioManager } from '@render/hooks/useAudioManager';
import { LolChampSelectV1Session } from '@shared/typings/lol/response/lolChampSelectV1Session';
import { useChampSelect } from '@render/hooks/useChampSelect';
import { useEffect } from 'react';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';

interface ChampSelectAudioProps {
  session: LolChampSelectV1Session;
}

export const ChampSelectAudio = ({ session }: ChampSelectAudioProps) => {
  const { playOnce } = useAudioManager();
  const { summonerData, getAction } = useChampSelect(session);

  const lobby = lobbyStore.lobby.use();

  const action = getAction();

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
      playOnce('music-cs-allrandom-howlingabyss');
    } else {
      playOnce('music-cs-blindpick-default');
    }
  }, [lobby?.gameConfig.gameMode]);

  return <></>;
};
