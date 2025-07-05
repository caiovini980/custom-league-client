import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { LolRankedV1RankedStats_Id } from '@shared/typings/lol/response/lolRankedV1RankedStats_Id';

interface RankedQueueStatsProps {
  stats: LolRankedV1RankedStats_Id;
}

export const RankedQueueStats = ({ stats }: RankedQueueStatsProps) => {
  const { tierImg } = useLeagueImage();
  const { rcpFeLolSharedComponents, rcpFeLolProfiles } = useLeagueTranslate();

  const { rcpFeLolSharedComponentsTransLeagueTierNames } =
    rcpFeLolSharedComponents;
  const { rcpFeLolProfilesTrans } = rcpFeLolProfiles;

  const getTierName = (tierKey: string) => {
    return rcpFeLolSharedComponentsTransLeagueTierNames(
      `lol_league_queue_name_${tierKey.toLowerCase()}`,
    );
  };

  const getRankedDivision = (
    queue: LolRankedV1RankedStats_Id['queues'][number],
  ) => {
    const { tier, division, leaguePoints } = queue;
    if (division === 'NA')
      return rcpFeLolSharedComponentsTransLeagueTierNames(
        'lol_league_tier_names_unranked',
      );
    const tierT = rcpFeLolSharedComponentsTransLeagueTierNames(
      `lol_league_tier_names_${tier.toLowerCase()}`,
    );
    const tierDivision = rcpFeLolSharedComponentsTransLeagueTierNames(
      'lol_league_lp',
      leaguePoints,
    );
    return `${tierT} ${division} - ${tierDivision}`;
  };

  const getWinLabel = (wins: number) => {
    if (wins > 1) {
      return rcpFeLolProfilesTrans('ranked_tooltip_wins_label[few]', wins);
    }
    if (wins === 1) {
      return rcpFeLolProfilesTrans('ranked_tooltip_wins_label[one]', wins);
    }
    return rcpFeLolProfilesTrans('ranked_tooltip_wins_label[zero]');
  };

  return (
    <Grid
      container
      spacing={2}
      justifyContent={'center'}
      alignItems={'center'}
      sx={{
        maxWidth: 500,
        color: 'inherit',
        overflow: 'auto',
        '& p': { fontSize: '0.8rem' },
      }}
    >
      {stats.queues.map((q) => (
        <Grid key={q.queueType}>
          <Stack
            direction={'column'}
            alignItems={'center'}
            component={Paper}
            variant={'outlined'}
            p={1}
            sx={{
              color: 'inherit',
              background: 'transparent',
              borderColor: 'rgba(255, 255, 255, 0.12)',
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
            <Typography>{getWinLabel(q.wins)}</Typography>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
};
