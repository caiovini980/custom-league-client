import { ButtonBase, Paper, Stack, Typography } from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import {
  LolHonorV2V1BallotEligible,
  LolHonorV2V1BallotHonoredPlayer,
} from '@shared/typings/lol/response/lolHonorV2V1Ballot';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { PropsWithChildren } from 'react';

interface HonorCardProps {
  eligiblePlayer: LolHonorV2V1BallotEligible;
  honoredPlayers: LolHonorV2V1BallotHonoredPlayer[];
  amountVote: number;
  summonerName: string;
}

export const HonorCard = ({
  eligiblePlayer,
  amountVote,
  honoredPlayers,
  summonerName,
}: HonorCardProps) => {
  const { lolGameDataImg, genericImg } = useLeagueImage();
  const { makeRequest } = useLeagueClientRequest();

  const onClickPlayer = () => {
    makeRequest('POST', '/lol-honor/v1/honor', {
      recipientPuuid: eligiblePlayer.puuid,
      honorType: 'HEART',
    }).then();
  };

  const isHonored = honoredPlayers.some(
    (hp) => hp.recipientPuuid === eligiblePlayer.puuid,
  );

  const disabled = () => {
    return (
      amountVote === honoredPlayers.length ||
      isHonored ||
      eligiblePlayer.botPlayer
    );
  };

  return (
    <Paper
      component={ButtonBase}
      onClick={onClickPlayer}
      sx={{
        width: '100%',
        maxWidth: 220,
        height: '100%',
        background: `linear-gradient(0deg, rgba(0,0,0,0.6) ${isHonored ? '100%' : '30%'}, rgba(0,0,0,0) 80%), url(${lolGameDataImg(eligiblePlayer.skinSplashPath)})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        p: 1,
        display: 'flex',
        justifyContent: 'end',
        flexDirection: 'column',
        '&:hover': {
          backgroundBlendMode: 'lighten',
        },
      }}
      variant={'outlined'}
      disabled={disabled()}
    >
      {isHonored && (
        <img
          alt={'voting_heart'}
          src={genericImg(
            'plugins/rcp-fe-lol-honor/global/default/assets/voting_heart.png',
          )}
        />
      )}
      <Typography fontSize={'0.9rem'}>{summonerName}</Typography>
      <Typography fontSize={'0.7rem'}>{eligiblePlayer.championName}</Typography>
    </Paper>
  );
};

export const HonorCardContainer = ({ children }: PropsWithChildren) => {
  return (
    <Stack
      direction={'row'}
      width={'100%'}
      height={'100%'}
      justifyContent={'space-between'}
      columnGap={2}
    >
      {children}
    </Stack>
  );
};
