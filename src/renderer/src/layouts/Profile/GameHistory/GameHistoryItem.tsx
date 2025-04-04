import {
  Avatar,
  ListItem,
  ListItemAvatar,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { ItemIcon } from '@render/layouts/Profile/GameHistory/ItemIcon';
import { SpellIcon } from '@render/layouts/Profile/GameHistory/SpellIcon';
import { LolMatchHistoryV1productsLol_Id_Matches } from '@shared/typings/lol/response/lolMatchHistoryV1ProductsLol_Id_Matches';

interface GameHistoryItemProps {
  game: LolMatchHistoryV1productsLol_Id_Matches['games']['games'][number];
}

export const GameHistoryItem = ({ game }: GameHistoryItemProps) => {
  const theme = useTheme();
  const { championIcon, spellIcon, itemIcon } = useLeagueImage();

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

    return {
      win: team.win === 'Win',
      queueName: 'Ranked Flex',
      championImg: championIcon(participant.championId),
      level: participant.stats.champLevel,
      spell1Img: spellIcon(participant.spell1Id),
      spell2Img: spellIcon(participant.spell2Id),
      date: game.gameCreationDate,
      duration: game.gameDuration,
      items,
      kda,
      minionsKilled,
      gold,
      map: game.mapId,
    };
  })();

  return (
    <ListItem
      sx={{
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
            fontSize: '0.6rem',
            borderRadius: '50%',
            p: '2px',
            background: theme.palette.getContrastText(
              theme.palette.text.primary,
            ),
          }}
        >
          {summaryGameData.level}
        </Typography>
      </ListItemAvatar>
      <Stack direction={'row'} width={'100%'} columnGap={2}>
        <Stack direction={'column'}>
          <Typography>{summaryGameData.win ? 'Victory' : 'Defeat'}</Typography>
          <Typography fontSize={'0.65rem !important'}>
            {summaryGameData.queueName}
          </Typography>
          <Stack direction={'row'}>
            <SpellIcon src={summaryGameData.spell1Img} />
            <SpellIcon src={summaryGameData.spell2Img} />
          </Stack>
        </Stack>
        <Stack direction={'column'} justifyContent={'space-between'} flex={1}>
          <Stack direction={'row'}>
            {summaryGameData.items.map((i) => (
              <ItemIcon key={i.itemId} src={i.src} />
            ))}
          </Stack>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography>{summaryGameData.kda}</Typography>
            <Typography>{summaryGameData.minionsKilled} C</Typography>
            <Typography>{summaryGameData.gold} G</Typography>
          </Stack>
          <Stack direction={'row'}>
            <Typography>{summaryGameData.map}</Typography>
            <Typography>{summaryGameData.date}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </ListItem>
  );
};
