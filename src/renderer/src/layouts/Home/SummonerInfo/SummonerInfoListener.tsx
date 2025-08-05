import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';

interface SummonerInfoListenerProps {
  summonerId: number;
}

export const SummonerInfoListener = ({
  summonerId,
}: SummonerInfoListenerProps) => {
  useLeagueClientEvent(
    buildEventUrl(
      '/lol-champions/v1/inventories/{digits}/champions',
      summonerId,
    ),
    (data) => {
      currentSummonerStore.champions.set(data);
    },
  );
  return null;
};
