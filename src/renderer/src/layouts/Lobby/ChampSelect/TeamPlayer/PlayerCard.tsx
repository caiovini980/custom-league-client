import { Stack, Typography } from '@mui/material';
import { SquareIcon } from '@render/components/SquareIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { LolChampSelectV1SessionTeam } from '@shared/typings/lol/response/lolChampSelectV1Session';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useRef, useState } from 'react';
import { LolChampSelectV1Summoners_Id } from '@shared/typings/lol/response/lolChampSelectV1Summoners_Id';
import { CircularIcon } from '@render/components/CircularIcon';
import { useStore } from '@render/zustand/store';
import { SwapButton } from '@render/layouts/Lobby/ChampSelect/TeamPlayer/SwapButton';
import {
  ProfileModal,
  ProfileModalRef,
} from '@render/layouts/Profile/ProfileModal';
import { CustomIconButton } from '@render/components/input';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useSnackNotification } from '@render/hooks/useSnackNotification';

interface TeamPlayerCardProps {
  slotId: number;
  isEnemyTeam?: boolean;
  player: LolChampSelectV1SessionTeam;
  side: 'blue' | 'red';
  amountPlayer: number;
}

export const TeamPlayerCard = ({
  slotId,
  player,
  isEnemyTeam,
  amountPlayer,
}: TeamPlayerCardProps) => {
  const champions = useStore().gameData.champions();
  const { championIcon, lolGameDataImg, loadChampionBackgroundImg } =
    useLeagueImage();
  const { rcpFeLolChampSelect } = useLeagueTranslate();
  const { makeRequest } = useLeagueClientRequest();
  const { snackError } = useSnackNotification();

  const rcpFeLolChampSelectTrans = rcpFeLolChampSelect('trans');

  const profileRef = useRef<ProfileModalRef>(null);

  const [summonerData, setSummonerData] =
    useState<LolChampSelectV1Summoners_Id>();

  useLeagueClientEvent(
    buildEventUrl('/lol-champ-select/v1/summoners/{digits}', slotId),
    (data) => {
      setSummonerData(data);
    },
    {
      deps: [slotId],
    },
  );

  const getCurrentAction = () => {
    if (summonerData?.statusMessageKey) {
      return rcpFeLolChampSelectTrans(summonerData.statusMessageKey);
    }
    return '';
  };

  const getChampionName = () => {
    return champions.find((c) => c.id === player.championId)?.name ?? '';
  };

  const skinUrl = loadChampionBackgroundImg(
    'splashPath',
    summonerData?.championId ?? 0,
    summonerData?.skinId,
  );

  const onClickIconChampion = async () => {
    const error = () => {
      snackError('Error on open profile');
    };

    const lookupProfile = await makeRequest(
      'GET',
      buildEventUrl(
        '/lol-summoner/v1/alias/lookup?gameName={string}&tagLine={string}',
        player.gameName,
        player.tagLine,
      ),
      undefined,
    );
    if (!lookupProfile.ok) {
      error();
      return;
    }
    const sum = await makeRequest(
      'GET',
      buildEventUrl(
        '/lol-summoner/v2/summoners/puuid/{uuid}',
        lookupProfile.body.puuid,
      ),
      undefined,
    );
    if (!sum.ok) {
      error();
      return;
    }
    profileRef.current?.open(sum.body.summonerId);
  };

  if (!summonerData) return null;

  return (
    <Stack
      direction={isEnemyTeam ? 'row-reverse' : 'row'}
      p={1}
      height={80}
      width={270}
      columnGap={1}
      alignItems={'center'}
      justifyContent={'flex-start'}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '10px',
        zIndex: 0,
        backgroundColor: summonerData?.isActingNow
          ? 'rgba(255,255,255,0.22)'
          : '',
        '&::before': {
          content: "''",
          zIndex: -1,
          inset: 0,
          position: 'absolute',
          background: `url(${skinUrl})`,
          backgroundSize: 'auto 250px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '-10px -45px',
          transform: isEnemyTeam ? 'scaleX(-1)' : undefined,
          filter: 'blur(0px)',
          maskImage:
            'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 40%)',
        },
      }}
    >
      <Stack
        direction={'column'}
        justifyContent={'space-between'}
        height={'100%'}
        display={isEnemyTeam ? 'none' : 'flex'}
      >
        <SquareIcon
          src={lolGameDataImg(summonerData.spell1IconPath)}
          size={25}
        />
        <SquareIcon
          src={lolGameDataImg(summonerData.spell2IconPath)}
          size={25}
        />
      </Stack>
      <CustomIconButton
        sx={{ p: 0.5 }}
        disabled={isEnemyTeam}
        onClick={onClickIconChampion}
      >
        <CircularIcon size={50} src={championIcon(player.championId)} />
      </CustomIconButton>
      {summonerData.shouldShowBanIntentIcon && (
        <SquareIcon
          src={championIcon(summonerData.banIntentChampionId)}
          size={30}
        />
      )}
      <Stack
        direction={'column'}
        rowGap={0.2}
        alignItems={isEnemyTeam ? 'flex-end' : 'flex-start'}
        sx={{
          width: '100%',
          color: summonerData.isSelf ? '#fff669' : undefined,
          '& p': {
            letterSpacing: '1.5px',
          },
        }}
      >
        <Typography fontSize={'0.7rem'}>{getCurrentAction()}</Typography>
        {isEnemyTeam ? (
          <>
            <Typography fontSize={'1rem'}>{getChampionName()}</Typography>
            <Typography fontSize={'0.8rem'}>
              {rcpFeLolChampSelectTrans(
                'name_visibility_type_enemy',
                slotId - (amountPlayer - 1),
              )}
            </Typography>
          </>
        ) : (
          <>
            <Typography fontSize={'1rem'}>
              {rcpFeLolChampSelectTrans(
                `summoner_assigned_position_${summonerData.assignedPosition.toLowerCase()}`,
              )}
            </Typography>
            <Typography fontSize={'0.7rem'}>{summonerData.gameName}</Typography>
          </>
        )}
      </Stack>
      {!isEnemyTeam && (
        <SwapButton
          slotId={slotId}
          cellId={summonerData.cellId}
          summonerName={summonerData.gameName}
          position={summonerData.assignedPosition.toLowerCase()}
          championName={summonerData.championName}
          showPickOrderSwap={summonerData.showSwaps}
          showPositionSwap={summonerData.showPositionSwaps}
          showChampionSwap={summonerData.showTrades}
        />
      )}
      <ProfileModal ref={profileRef} />
    </Stack>
  );
};
