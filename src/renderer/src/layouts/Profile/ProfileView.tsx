import { Stack } from '@mui/material';
import CustomTab, { CustomTabPanel } from '@render/components/CustomTab';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { ChampionMastery } from '@render/layouts/Profile/ChampionMastery';
import { GameHistory } from '@render/layouts/Profile/GameHistory/GameHistory';
import { RankedStats } from '@render/layouts/Profile/RankedStats';
import { capitalize } from '@render/utils/stringUtil';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';
import { useState } from 'react';

interface ProfileViewProps {
  summonerId: number;
}

export const ProfileView = ({ summonerId }: ProfileViewProps) => {
  const { lolGameDataImg, genericImg } = useLeagueImage();
  const { rcpFeLolMatchHistory, rcpFeLolCollections } = useLeagueTranslate();

  const { rcpFeLolMatchHistoryTrans } = rcpFeLolMatchHistory;
  const { rcpFeLolCollectionsTrans } = rcpFeLolCollections;

  const [summonerData, setSummonerData] = useState<LolSummonerV1Summoners_Id>();
  const [backgroundUrl, setBackgroundUrl] = useState(
    genericImg(
      'plugins/rcp-fe-lol-static-assets/global/default/lcu-alpha-backdrop.jpg',
    ),
  );
  const [currentTab, setCurrentTab] = useState('overview');

  useLeagueClientEvent(
    buildEventUrl(
      '/lol-collections/v1/inventories/{digits}/backdrop',
      summonerId,
    ),
    (data) => {
      if (data.backdropImage) {
        setBackgroundUrl(lolGameDataImg(data.backdropImage));
      }
    },
  );

  useLeagueClientEvent(
    buildEventUrl('/lol-summoner/v1/summoners/{digits}', summonerId),
    (data) => {
      setSummonerData(data);
    },
  );

  const normalizeTitle = (text: string) => {
    return capitalize(text.toLowerCase());
  };

  if (!summonerData) return null;

  return (
    <Stack
      direction={'column'}
      height={'100%'}
      width={'100%'}
      alignItems={'center'}
      sx={{
        position: 'relative',
        color: 'white',
        zIndex: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          background: `url(${backgroundUrl})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          filter: currentTab !== 'overview' ? 'blur(12px)' : undefined,
        },
      }}
    >
      <Stack direction={'row'} width={'100%'} height={'100%'}>
        <CustomTab
          onChange={(t) => setCurrentTab(t.name)}
          tabsProps={{
            orientation: 'horizontal',
          }}
        >
          <CustomTabPanel
            label={normalizeTitle(
              rcpFeLolMatchHistoryTrans('MATCH_DETAILS_SUB_NAV_TITLE_OVERVIEW'),
            )}
            name={'overview'}
          >
            <RankedStats summonerData={summonerData} />
          </CustomTabPanel>
          <CustomTabPanel
            label={normalizeTitle(
              rcpFeLolMatchHistoryTrans('MATCH_HISTORY_PROFILE_SUB_MENU_TITLE'),
            )}
            name={'history'}
          >
            <GameHistory puuid={summonerData.puuid} />
          </CustomTabPanel>
          <CustomTabPanel
            label={normalizeTitle(
              rcpFeLolCollectionsTrans(
                'collections_sub_nav_collectibles_champions',
              ),
            )}
            name={'mastery'}
          >
            <ChampionMastery puuid={summonerData.puuid} />
          </CustomTabPanel>
        </CustomTab>
      </Stack>
    </Stack>
  );
};
