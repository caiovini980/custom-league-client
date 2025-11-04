import { ButtonBase, Stack } from '@mui/material';
import { SquareIcon } from '@render/components/SquareIcon';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { useState } from 'react';

export const AramBenchChampions = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { championIcon } = useLeagueImage();
  const aram = champSelectStore.aram.use();
  const summonerChampions = currentSummonerStore.champions.use();
  const summonerChampionId = champSelectStore.getCurrentSummonerData(
    (s) => s.championId,
    0,
  );

  const [subsetChampion, setSubsetChampion] = useState<number[]>([0, 0]);

  const championsAvailable = summonerChampions
    .filter((c) => c.active)
    .filter(
      (c) => c.freeToPlay || c.ownership.owned || subsetChampion.includes(c.id),
    )
    .map((c) => c.id);

  useLeagueClientEvent(
    '/lol-lobby-team-builder/champ-select/v1/subset-champion-list',
    (data) => {
      setSubsetChampion(data);
    },
  );

  if (!aram.benchEnabled) return;

  const onClickChampion = (championId: number) => {
    makeRequest(
      'POST',
      buildEventUrl(
        '/lol-champ-select/v1/session/bench/swap/{digits}',
        championId,
      ),
      undefined,
    );
  };

  const championDisabled = (championId: number) => {
    return (
      summonerChampionId === championId ||
      !championsAvailable.includes(championId)
    );
  };

  return (
    <Stack
      direction={'row'}
      columnGap={1}
      width={'100%'}
      justifyContent={'center'}
    >
      {aram.benchChampions.map((bc) => {
        return (
          <ButtonBase
            key={bc.championId}
            onClick={() => onClickChampion(bc.championId)}
            disabled={championDisabled(bc.championId)}
          >
            <SquareIcon
              src={championIcon(bc.championId)}
              size={50}
              grayScale={championDisabled(bc.championId)}
            />
          </ButtonBase>
        );
      })}
    </Stack>
  );
};
