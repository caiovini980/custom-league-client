import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { LolRankedV1RankedStats_Id } from '@shared/typings/lol/response/lolRankedV1RankedStats_Id';

interface RankedQueueStatsProps {
  stats: LolRankedV1RankedStats_Id;
}

export const RankedQueueStats = ({ stats }: RankedQueueStatsProps) => {
  const { tierImg } = useLeagueImage();
  const { rcpFeLolSharedComponents } = useLeagueTranslate();

  const transLeagueTierNames = rcpFeLolSharedComponents(
    'trans-league-tier-names',
  );

  const getTierName = (tierKey: string) => {
    return transLeagueTierNames(
      `lol_league_queue_name_${tierKey.toLowerCase()}`,
    );
  };

  const getRankedDivision = (
    queue: LolRankedV1RankedStats_Id['queues'][number],
  ) => {
    const { tier, division, leaguePoints } = queue;
    if (division === 'NA')
      return transLeagueTierNames('lol_league_tier_names_unranked');
    const tierT = transLeagueTierNames(
      `lol_league_tier_names_${tier.toLowerCase()}`,
    );
    const tierDivision = transLeagueTierNames('lol_league_lp', leaguePoints);
    return `${tierT} ${division} - ${tierDivision}`;
  };

  return (
    <Grid
      container
      spacing={2}
      justifyContent={'center'}
      sx={{ overflow: 'auto', px: 1, '& p': { fontSize: '0.8rem' } }}
    >
      {stats.queues.map((q) => (
        <Grid key={q.queueType} size={{ xs: 6 }}>
          <Stack
            direction={'column'}
            alignItems={'center'}
            component={Paper}
            variant={'outlined'}
            p={1}
            sx={{
              background: 'transparent',
            }}
          >
            <Typography>{getTierName(q.queueType)}</Typography>
            <Box
              component={'img'}
              src={tierImg(q.tier)}
              alt={'tier'}
              height={80}
            />
            <Typography>{getRankedDivision(q)}</Typography>
            <Typography>
              {q.wins} Wins / {q.losses} Losses
            </Typography>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
};
