import { Stack, Typography } from '@mui/material';
import { SquareIcon } from '@render/components/SquareIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import {
  LolChampSelectV1Session,
  LolChampSelectV1SessionTeam,
} from '@shared/typings/lol/response/lolChampSelectV1Session';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useState } from 'react';
import { LolChampSelectV1Summoners_Id } from '@shared/typings/lol/response/lolChampSelectV1Summoners_Id';
import { CircularIcon } from '@render/components/CircularIcon';

interface TeamPlayerCardProps {
  isEnemyTeam?: boolean;
  player: LolChampSelectV1SessionTeam;
  session: LolChampSelectV1Session;
}

export const TeamPlayerCard = ({
  player,
  isEnemyTeam,
}: TeamPlayerCardProps) => {
  const { championIcon, spellIcon } = useLeagueImage();
  const { rcpFeLolChampSelect } = useLeagueTranslate();

  const rcpFeLolChampSelectTrans = rcpFeLolChampSelect('trans');

  const [summonerData, setSummonerData] =
    useState<LolChampSelectV1Summoners_Id>();

  useLeagueClientEvent(
    buildEventUrl('/lol-champ-select/v1/summoners/{digits}', player.cellId),
    (data) => {
      setSummonerData(data);
    },
  );

  const getCurrentAction = () => {
    if (summonerData?.statusMessageKey) {
      return rcpFeLolChampSelectTrans(summonerData.statusMessageKey);
    }
    return '';
  };

  if (!summonerData) return null;

  return (
    <Stack
      direction={isEnemyTeam ? 'row-reverse' : 'row'}
      p={1}
      height={80}
      width={220}
      columnGap={0.5}
      alignItems={'center'}
      justifyContent={'flex-start'}
      sx={{
        overflow: 'hidden',
        background: 'rgba(0,0,0,0.2)',
        backdropFilter: 'blur(20px)',
        borderRadius: '10px',
      }}
    >
      <Stack
        direction={'column'}
        justifyContent={'space-between'}
        height={'100%'}
      >
        <SquareIcon src={spellIcon(player.spell1Id)} size={25} />
        <SquareIcon src={spellIcon(player.spell2Id)} size={25} />
      </Stack>
      <CircularIcon
        size={50}
        src={championIcon(player.championPickIntent || player.championId)}
      />
      {summonerData.shouldShowBanIntentIcon && (
        <SquareIcon src={championIcon(summonerData.banIntentChampionId)} />
      )}
      <Stack direction={'column'} rowGap={0.2}>
        <Typography>{getCurrentAction()}</Typography>
        {isEnemyTeam ? (
          <>
            <Typography fontSize={'1rem'}>
              {summonerData.championName}
            </Typography>
            <Typography fontSize={'0.8rem'}>
              {rcpFeLolChampSelectTrans(
                'name_visibility_type_enemy',
                summonerData.cellId - 4,
              )}
            </Typography>
          </>
        ) : (
          <>
            <Typography fontSize={'0.85rem'}>
              {rcpFeLolChampSelectTrans(
                `summoner_assigned_position_${summonerData.assignedPosition.toLocaleLowerCase()}`,
              )}
            </Typography>
            <Typography fontSize={'0.6rem'}>{summonerData.gameName}</Typography>
          </>
        )}
      </Stack>
    </Stack>
  );
};
