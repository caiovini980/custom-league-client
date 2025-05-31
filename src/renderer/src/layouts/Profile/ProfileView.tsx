import { Stack } from '@mui/material';
import CustomTab, { CustomTabPanel } from '@render/components/CustomTab';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { ChampionMastery } from '@render/layouts/Profile/ChampionMastery';
import { GameHistory } from '@render/layouts/Profile/GameHistory/GameHistory';
import { RankedStats } from '@render/layouts/Profile/RankedStats';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';
import { useState } from 'react';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { capitalize } from '@render/utils/stringUtil';
import { alpha } from '@mui/material/styles';

interface ProfileViewProps {
  summonerId: number;
  marginBottom?: number;
}

export const ProfileView = ({ summonerId, marginBottom }: ProfileViewProps) => {
  const { lolGameDataImg } = useLeagueImage();
  const { rcpFeLolMatchHistory } = useLeagueTranslate();

  const rcpFeLolMatchHistoryTrans = rcpFeLolMatchHistory('trans');

  const [summonerData, setSummonerData] = useState<LolSummonerV1Summoners_Id>();
  const [backgroundUrl, setBackgroundUrl] = useState('');

  useLeagueClientEvent(
    buildEventUrl(
      '/lol-collections/v1/inventories/{digits}/backdrop',
      summonerId,
    ),
    (data) => {
      setBackgroundUrl(lolGameDataImg(data.backdropImage));
    },
  );

  useLeagueClientEvent(
    buildEventUrl('/lol-summoner/v1/summoners/{digits}', summonerId),
    (data) => {
      setSummonerData(data);
    },
  );

  if (!summonerData) return null;

  return (
    <Stack
      direction={'column'}
      height={'100%'}
      width={'100%'}
      alignItems={'center'}
      sx={{
        color: 'white',
        background: (t) =>
          `linear-gradient(0deg, ${alpha(t.palette.background.default, 0.55)} 40%, rgba(0,0,0,0) 100%), url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        pt: '30vh',
        pb: marginBottom ? `${marginBottom}px` : 0,
      }}
    >
      <Stack direction={'row'} width={'100%'} height={'100%'}>
        <RankedStats summonerData={summonerData} />
        <CustomTab>
          <CustomTabPanel
            label={capitalize(
              rcpFeLolMatchHistoryTrans(
                'MATCH_HISTORY_PROFILE_SUB_MENU_TITLE',
              ).toLowerCase(),
            )}
            name={'history'}
          >
            <GameHistory puuid={summonerData.puuid} />
          </CustomTabPanel>
          <CustomTabPanel label={'Champion Mastery'} name={'mastery'}>
            <ChampionMastery puuid={summonerData.puuid} />
          </CustomTabPanel>
        </CustomTab>
      </Stack>
    </Stack>
  );
};
