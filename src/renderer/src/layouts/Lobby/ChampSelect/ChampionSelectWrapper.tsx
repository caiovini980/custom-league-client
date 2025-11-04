import { Box } from '@mui/material';
import {
  buildEventUrl,
  onLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { hiddenName } from '@render/utils/nameToHiddenSummonerName';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';
import { PropsWithChildren, useEffect } from 'react';

export const ChampionSelectWrapper = ({ children }: PropsWithChildren) => {
  const { loadChampionBackgroundImg, genericImg } = useLeagueImage();
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolChampSelect } = useLeagueTranslate();

  const { rcpFeLolChampSelectTrans } = rcpFeLolChampSelect;

  const skinId = champSelectStore.getCurrentSummonerData((s) => s.skinId, 0);
  const championId = champSelectStore.getCurrentSummonerData(
    (s) => s.championId,
    0,
  );
  const action = champSelectStore.currentAction.use();
  const gameMode = champSelectStore.gameMode.use();
  const amountPlayer = champSelectStore.amountPlayer.use();
  const bans = champSelectStore.bans.use();

  const skinUrl = () => {
    const { banIntentChampionId } = bans;

    if (action === 'ban') {
      if (banIntentChampionId !== 0) {
        return loadChampionBackgroundImg('splashPath', banIntentChampionId);
      }
    } else if (championId !== 0) {
      return loadChampionBackgroundImg('splashPath', championId, skinId);
    }

    const gameModeParse: Record<string, string> = {
      ARAM: 'aram',
      CLASSIC: 'classic_sru',
    };

    const gameModePath = gameModeParse[gameMode] ?? 'classic_sru';

    return genericImg(
      `/plugins/rcp-be-lol-game-data/global/default/content/src/leagueclient/gamemodeassets/${gameModePath}/img/parties-background.jpg`,
    );
  };

  useEffect(() => {
    const summonerDataList: { unsubscribe: () => void }[] = [];
    for (let slotId = 0; slotId < amountPlayer; slotId++) {
      const url = buildEventUrl(
        '/lol-champ-select/v1/summoners/{digits}',
        slotId,
      );
      makeRequest('GET', url, undefined).then((res) => {
        if (res.ok) {
          champSelectStore.summoners.assign({
            [slotId]: res.body,
          });
          champSelectStore.summonerName.assign({
            [res.body.obfuscatedSummonerId]:
              res.body.nameVisibilityType === 'HIDDEN'
                ? rcpFeLolChampSelectTrans(
                    `name_visibility_type_team_hidden_${hiddenName[slotId]}`,
                  )
                : res.body.gameName,
          });
        }
      });
      const ev = onLeagueClientEvent(
        url,
        (data) => {
          champSelectStore.summoners.assign({
            [slotId]: data,
          });
        },
        false,
      );
      summonerDataList.push(ev);
    }

    return () => {
      summonerDataList.forEach((sd) => {
        sd.unsubscribe();
      });
    };
  }, []);

  return (
    <Box
      className={'theme-dark'}
      height={'100%'}
      width={'100%'}
      display={'flex'}
      sx={{
        background: `linear-gradient(0deg, rgba(0,0,0,0.8) 5%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.8) 100%), url(${skinUrl()})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        color: 'var(--mui-palette-common-white)',
      }}
    >
      {children}
    </Box>
  );
};
