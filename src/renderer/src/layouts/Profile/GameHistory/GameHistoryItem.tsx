import {
  Avatar,
  ListItem,
  ListItemAvatar,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { ItemIcon } from '@render/layouts/Profile/GameHistory/ItemIcon';
import { SpellIcon } from '@render/layouts/Profile/GameHistory/SpellIcon';
import { useStore } from '@render/zustand/store';
import { LolMatchHistoryV1productsLol_Id_Matches } from '@shared/typings/lol/response/lolMatchHistoryV1ProductsLol_Id_Matches';
import { formatDateTime, secondsToDisplayTime } from '@shared/utils/date.util';
import { formatCurrency } from '@shared/utils/string.util';

interface GameHistoryItemProps {
  game: LolMatchHistoryV1productsLol_Id_Matches['games']['games'][number];
}

export const GameHistoryItem = ({ game }: GameHistoryItemProps) => {
  const theme = useTheme();
  const { championIcon, spellIcon, itemIcon } = useLeagueImage();
  const maps = useStore().gameData.maps();
  const queues = useStore().gameData.queues();

  const summaryGameData = (() => {
    const participantId = game.participantIdentities[0].participantId;
    const participant = game.participants.find(
      (p) => p.participantId === participantId,
    );

    if (!participant) {
      throw new Error('participant dont exist');
    }

    const teamId = participant.teamId;
    const team = game.teams.find((t) => t.teamId === teamId);

    if (!team) {
      throw new Error('team dont exist');
    }

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
      win: team.win === 'Win',
      queueName,
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
    <ListItem
      sx={{
        background: alpha(summaryGameData.win ? '#76ff68' : '#ff7a7a', 0.1),
        '& p': {
          fontSize: '0.8rem',
        },
      }}
    >
      <ListItemAvatar sx={{ position: 'relative' }}>
        <Avatar src={summaryGameData.championImg} />
        <Typography
          sx={{
            position: 'absolute',
            bottom: -5,
            right: 15,
            fontSize: '0.6rem !important',
            borderRadius: '50%',
            p: '2px',
            textAlign: 'center',
            width: 18,
            height: 18,
            background: theme.palette.getContrastText(
              theme.palette.text.primary,
            ),
          }}
        >
          {summaryGameData.level}
        </Typography>
      </ListItemAvatar>
      <Stack direction={'row'} width={'100%'} columnGap={2}>
        <Stack direction={'column'} width={85}>
          <Typography>{summaryGameData.win ? 'Victory' : 'Defeat'}</Typography>
          <Typography fontSize={'0.65rem !important'}>
            {summaryGameData.queueName}
          </Typography>
          <Stack direction={'row'}>
            <SpellIcon src={summaryGameData.spell1Img} />
            <SpellIcon src={summaryGameData.spell2Img} />
          </Stack>
        </Stack>
        <Stack
          direction={'column'}
          justifyContent={'space-between'}
          flex={1}
          rowGap={0.5}
        >
          <Stack direction={'row'}>
            {summaryGameData.items.map((i, index) => (
              <ItemIcon key={index} src={i.src} />
            ))}
          </Stack>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography>{summaryGameData.kda}</Typography>
            <Typography>
              {formatCurrency(summaryGameData.minionsKilled, 0)} C
            </Typography>
            <Typography>{formatCurrency(summaryGameData.gold, 0)} G</Typography>
          </Stack>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography>
              {summaryGameData.map} ({summaryGameData.duration})
            </Typography>
            <Typography>{summaryGameData.date}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </ListItem>
  );
};
