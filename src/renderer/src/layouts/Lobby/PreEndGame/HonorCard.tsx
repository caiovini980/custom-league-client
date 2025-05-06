import { ButtonBase, Paper, Typography } from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import {
  LolHonorV2V1BallotEligible,
  LolHonorV2V1BallotHonoredPlayer,
} from '@shared/typings/lol/response/lolHonorV2V1Ballot';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useEffect, useState } from 'react';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';

interface HonorCardProps {
  eligiblePlayer: LolHonorV2V1BallotEligible;
  honoredPlayers: LolHonorV2V1BallotHonoredPlayer[];
  amountVote: number;
}

export const HonorCard = ({
  eligiblePlayer,
  amountVote,
  honoredPlayers,
}: HonorCardProps) => {
  const { lolGameDataImg, genericImg } = useLeagueImage();
  const { makeRequest } = useLeagueClientRequest();

  const [summoner, setSummoner] = useState<LolSummonerV1Summoners_Id>();

  useEffect(() => {
    makeRequest(
      'GET',
      buildEventUrl(
        '/lol-summoner/v1/summoners/{digits}',
        eligiblePlayer.summonerId,
      ),
      undefined,
    ).then((res) => {
      if (res.ok) {
        setSummoner(res.body);
      }
    });
  }, [eligiblePlayer.summonerId]);

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
        background: `linear-gradient(0deg, rgba(0,0,0,0.85) 10%, rgba(0,0,0,0) 100%), url(${lolGameDataImg(eligiblePlayer.skinSplashPath)})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        p: 1,
        display: 'flex',
        justifyContent: 'end',
        flexDirection: 'column',
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
      <Typography fontSize={'0.9rem'}>{summoner?.gameName}</Typography>
      <Typography fontSize={'0.7rem'}>{eligiblePlayer.championName}</Typography>
    </Paper>
  );
};
