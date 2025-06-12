import { ListItemAvatar, Stack, Typography, useTheme } from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { ItemIcon } from '@render/layouts/Profile/GameHistory/ItemIcon';
import { SpellIcon } from '@render/layouts/Profile/GameHistory/SpellIcon';
import { useStore } from '@render/zustand/store';
import { LolMatchHistoryV1productsLol_Id_Matches } from '@shared/typings/lol/response/lolMatchHistoryV1ProductsLol_Id_Matches';
import { formatDateTime, secondsToDisplayTime } from '@shared/utils/date.util';
import { formatCurrency } from '@shared/utils/string.util';
import { PropsWithChildren, useRef } from 'react';
import { CircularIcon } from '@render/components/CircularIcon';
import { alpha } from '@mui/material/styles';
import { CustomIconButton } from '@render/components/input';
import {
  ProfileModal,
  ProfileModalRef,
} from '@render/layouts/Profile/ProfileModal';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { IconValue } from '@render/layouts/Profile/GameHistory/IconValue';
import { useSpriteImage } from '@render/hooks/useSpriteImage';

interface GenericGameHistoryItemProps {
  participantId: number;
  isOtherPlayer?: boolean;
  game: LolMatchHistoryV1productsLol_Id_Matches['games']['games'][number];
}

export const GenericGameHistoryItem = ({
  participantId,
  isOtherPlayer = false,
  game,
  children,
}: PropsWithChildren<GenericGameHistoryItemProps>) => {
  const theme = useTheme();
  const { championIcon, spellIcon, itemIcon, genericImg } = useLeagueImage();
  const { rcpFeLolMatchHistory } = useLeagueTranslate();
  const { getSprite: getMinionSprite } = useSpriteImage({
    src: 'plugins/rcp-fe-lol-match-history/global/default/icon_minions.png',
    height: 50,
    width: 50,
  });
  const { getSprite: getGoldSprite } = useSpriteImage({
    src: 'plugins/rcp-fe-lol-match-history/global/default/icon_gold.png',
    height: 52,
    width: 54,
  });
  const maps = useStore().gameData.maps();
  const queues = useStore().gameData.queues();

  const profileRef = useRef<ProfileModalRef>(null);

  const rcpFeLolMatchHistoryTrans = rcpFeLolMatchHistory('trans');

  const summaryGameData = (() => {
    const participant = game.participants.find(
      (p) => p.participantId === participantId,
    );

    if (!participant) {
      throw new Error('participant dont exist');
    }

    const teamId = participant.teamId;
    const team = game.teams.find((t) => t.teamId === teamId);

    const items = new Array(7).fill(0).map((_, index) => {
      const itemId = participant.stats[`item${index}`];
      return { itemId, src: itemIcon(itemId) };
    });

    const kda = `${participant.stats.kills} / ${participant.stats.deaths} / ${participant.stats.assists}`;
    const minionsKilled =
      participant.stats.totalMinionsKilled +
      participant.stats.neutralMinionsKilled;
    const gold = participant.stats.goldEarned;

    const queueName = queues.find((q) => q.id === game.queueId)?.name ?? '';
    const map = maps.find((m) => m.id === game.mapId)?.name ?? '';

    return {
      win: team?.win === 'Win',
      queueName,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      player: game.participantIdentities.find(
        (pi) => pi.participantId === participantId,
      )!.player,
      championImg: championIcon(participant.championId),
      level: participant.stats.champLevel,
      spell1Img: spellIcon(participant.spell1Id),
      spell2Img: spellIcon(participant.spell2Id),
      date: formatDateTime(game.gameCreationDate),
      duration: secondsToDisplayTime(game.gameDuration),
      items,
      kda,
      minionsKilled,
      gold,
      map,
    };
  })();

  return (
    <Stack
      direction={'row'}
      width={'100%'}
      columnGap={2}
      p={1}
      position={'relative'}
      sx={{
        background: (t) =>
          alpha(
            summaryGameData.win
              ? t.palette.matchHistory.win
              : t.palette.matchHistory.defeat,
            0.6,
          ),
        '& p': {
          fontSize: '0.8rem',
        },
      }}
    >
      <ListItemAvatar
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: 90,
        }}
      >
        <CustomIconButton
          sx={{ p: 0.5 }}
          disabled={!isOtherPlayer}
          onClick={() =>
            profileRef.current?.open(summaryGameData.player.summonerId)
          }
        >
          <CircularIcon src={summaryGameData.championImg} />
        </CustomIconButton>
        <Typography fontSize={'0.6rem !important'}>
          {summaryGameData.player.gameName}
        </Typography>
        <Typography
          sx={{
            position: 'absolute',
            top: 0,
            left: 15,
            fontSize: '0.6rem !important',
            borderRadius: '50%',
            p: '2px',
            textAlign: 'center',
            width: 18,
            height: 18,
            color: theme.palette.getContrastText(
              theme.palette.background.default,
            ),
            background: theme.palette.background.default,
          }}
        >
          {summaryGameData.level}
        </Typography>
      </ListItemAvatar>
      <Stack direction={'row'} width={100} columnGap={1}>
        <Stack direction={'column'} justifyContent={'space-evenly'}>
          <SpellIcon src={summaryGameData.spell1Img} />
          <SpellIcon src={summaryGameData.spell2Img} />
        </Stack>
        <Stack direction={'column'} justifyContent={'space-evenly'}>
          <Typography>
            {rcpFeLolMatchHistoryTrans(
              summaryGameData.win
                ? 'MATCH_HISTORY_MATCH_RESULT_VICTORY'
                : 'MATCH_HISTORY_MATCH_RESULT_DEFEAT',
            )}
          </Typography>
          <Typography fontSize={'0.65rem !important'}>
            {summaryGameData.queueName}
          </Typography>
        </Stack>
      </Stack>
      <Stack
        direction={'column'}
        justifyContent={'space-between'}
        alignItems={'center'}
        rowGap={0.5}
      >
        <Stack direction={'row'}>
          {summaryGameData.items.map((i, index) => (
            <ItemIcon key={index} itemId={i.itemId} src={i.src} />
          ))}
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'} width={265}>
          <IconValue
            src={genericImg(
              'plugins/rcp-fe-lol-match-history/global/default/kills.png',
            )}
            value={summaryGameData.kda}
            size={14}
          />
          <IconValue
            src={getMinionSprite(0)}
            value={formatCurrency(summaryGameData.minionsKilled, 0)}
            size={14}
          />
          <IconValue
            src={getGoldSprite(0)}
            value={formatCurrency(summaryGameData.gold, 0)}
            size={14}
          />
        </Stack>
      </Stack>
      <Stack
        direction={'column'}
        width={160}
        justifyContent={'space-between'}
        flexShrink={0}
        display={!isOtherPlayer ? 'flex' : 'none'}
      >
        <Typography>
          {summaryGameData.map} ({summaryGameData.duration})
        </Typography>
        <Typography>{summaryGameData.date}</Typography>
      </Stack>
      {children}
      <ProfileModal ref={profileRef} />
    </Stack>
  );
};
