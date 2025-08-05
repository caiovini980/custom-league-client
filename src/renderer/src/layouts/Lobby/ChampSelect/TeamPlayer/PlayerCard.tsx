import { Stack, Typography } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import { CustomIconButton } from '@render/components/input';
import { SquareIcon } from '@render/components/SquareIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { SwapButton } from '@render/layouts/Lobby/ChampSelect/TeamPlayer/SwapButton';
import { ReportModal, ReportModalRef } from '@render/layouts/Lobby/ReportModal';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';
import { gameDataStore } from '@render/zustand/stores/gameDataStore';
import { memo, useRef } from 'react';
import { FaCircleExclamation } from 'react-icons/fa6';

interface TeamPlayerCardProps {
  slotId: number;
  isEnemyTeam?: boolean;
  amountPlayer: number;
}

export const TeamPlayerCard = ({
  slotId,
  isEnemyTeam,
  amountPlayer,
}: TeamPlayerCardProps) => {
  const champions = gameDataStore.champions.use();
  const { championIcon, lolGameDataImg, loadChampionBackgroundImg } =
    useLeagueImage();
  const { rcpFeLolChampSelect } = useLeagueTranslate();

  const { rcpFeLolChampSelectTrans } = rcpFeLolChampSelect;

  const summonerData = champSelectStore.summonerDataBySlotId.use(slotId);
  const gameId = champSelectStore.session.use((s) => s.gameId);

  const reportModalRef = useRef<ReportModalRef>(null);

  if (!summonerData) return null;

  const getCurrentAction = () => {
    if (summonerData?.statusMessageKey) {
      return rcpFeLolChampSelectTrans(summonerData.statusMessageKey);
    }
    return '';
  };

  const getChampionName = () => {
    return champions.find((c) => c.id === summonerData?.championId)?.name ?? '';
  };

  const skinUrl = loadChampionBackgroundImg(
    'splashPath',
    summonerData?.championId ?? 0,
    summonerData?.skinId,
  );

  return (
    <Stack
      direction={isEnemyTeam ? 'row-reverse' : 'row'}
      py={1}
      px={0.5}
      height={80}
      width={270}
      columnGap={0.5}
      alignItems={'center'}
      justifyContent={'flex-start'}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        zIndex: 0,
        backgroundColor: summonerData.isActingNow
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
      <CircularIcon size={50} src={championIcon(summonerData.championId)} />
      {summonerData.shouldShowBanIntentIcon && (
        <SquareIcon
          src={championIcon(summonerData.banIntentChampionId)}
          size={30}
        />
      )}
      <Stack
        direction={'column'}
        alignItems={isEnemyTeam ? 'flex-end' : 'flex-start'}
        sx={{
          width: '100%',
          color: summonerData.isSelf
            ? 'var(--mui-palette-highlight-main)'
            : undefined,
          '& p': {
            letterSpacing: '1.2px',
          },
        }}
      >
        <Typography fontSize={'0.7rem'}>{getCurrentAction()}</Typography>
        <Typography fontSize={'1rem'}>{getChampionName()}</Typography>
        {isEnemyTeam ? (
          <Typography fontSize={'0.6rem'}>
            {rcpFeLolChampSelectTrans(
              'name_visibility_type_enemy',
              slotId - (amountPlayer - 1),
            )}
          </Typography>
        ) : (
          <>
            <Typography fontSize={'1.2rem'}>
              {rcpFeLolChampSelectTrans(
                `summoner_assigned_position_${summonerData.assignedPosition.toLowerCase()}`,
              )}
            </Typography>
            <Typography fontSize={'0.6rem'} color={'textSecondary'}>
              {summonerData.gameName}
            </Typography>
          </>
        )}
      </Stack>
      <Stack
        direction={'column'}
        justifyContent={'space-evenly'}
        alignItems={'center'}
      >
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
        {!summonerData.isSelf && (
          <CustomIconButton
            color={'error'}
            onClick={() =>
              reportModalRef.current?.open(summonerData.puuid, gameId)
            }
            sx={{
              p: 0.2,
            }}
          >
            <FaCircleExclamation size={20} />
          </CustomIconButton>
        )}
      </Stack>
      <ReportModal type={'champ-select-reports'} ref={reportModalRef} />
    </Stack>
  );
};

export const TeamPlayerCardMemo = memo(TeamPlayerCard);
