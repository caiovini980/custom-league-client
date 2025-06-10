import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';
import { CircularIcon } from '@render/components/CircularIcon';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useState } from 'react';
import { LolChallengesV1SummaryPlayerDataPlayer_Id } from '@shared/typings/lol/response/lolChallengesV1SummaryPlayerDataPlayer_Id';

interface SummonerDetailsProps {
  summoner: LolSummonerV1Summoners_Id;
}

export const SummonerDetails = ({ summoner }: SummonerDetailsProps) => {
  const { profileIcon } = useLeagueImage();

  const iconSize = 180;
  const levelSize = 55;

  const [challengeStats, setChallengeStats] =
    useState<LolChallengesV1SummaryPlayerDataPlayer_Id>();

  useLeagueClientEvent(
    buildEventUrl(
      '/lol-challenges/v1/summary-player-data/player/{uuid}',
      summoner.puuid,
    ),
    (data) => {
      setChallengeStats(data);
    },
  );

  return (
    <Stack direction={'row'} alignItems={'center'} columnGap={5}>
      <Box position={'relative'}>
        <CircularIcon
          src={profileIcon(summoner.profileIconId)}
          size={iconSize}
        />
        <Typography
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: levelSize,
            height: levelSize,
            fontWeight: 'bold',
            borderRadius: '50%',
            background: '#424242',
            flexShrink: 0,
            fontSize: '0.9rem',
          }}
        >
          {summoner.summonerLevel}
        </Typography>
        <CircularProgress
          size={levelSize}
          variant={'determinate'}
          value={100 - summoner.xpUntilNextLevel}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}
        />
      </Box>
      <Stack direction={'column'}>
        <Typography variant={'h3'}>{summoner.gameName}</Typography>
        <Typography variant={'h6'}>{challengeStats?.title.name}</Typography>
      </Stack>
    </Stack>
  );
};
