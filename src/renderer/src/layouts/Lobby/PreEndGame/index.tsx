import { Stack, Typography } from '@mui/material';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useState } from 'react';
import {
  LolHonorV2V1Ballot,
  LolHonorV2V1BallotEligible,
} from '@shared/typings/lol/response/lolHonorV2V1Ballot';
import { LoadingScreen } from '@render/components/LoadingScreen';
import config from '@render/utils/config.util';
import { HonorCard } from '@render/layouts/Lobby/PreEndGame/HonorCard';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { CustomButton } from '@render/components/input';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';

export const PreEndGame = () => {
  const { rcpFeLolHonor, rcpFeLolPostgame } = useLeagueTranslate();
  const { makeRequest } = useLeagueClientRequest();

  const rcpFeLolHonorTrans = rcpFeLolHonor('trans');
  const rcpFeLolPostgameTrans = rcpFeLolPostgame('trans');

  const [honorData, setHonorData] = useState<LolHonorV2V1Ballot>();

  useLeagueClientEvent('/lol-honor-v2/v1/ballot', (data) => {
    setHonorData(data);
  });

  const renderHonorPlayer = (eligibles: LolHonorV2V1BallotEligible[]) => {
    if (!honorData) return;
    return (
      <Stack
        direction={'row'}
        width={'100%'}
        height={'100%'}
        justifyContent={'space-between'}
        columnGap={2}
      >
        {eligibles.map((ea) => {
          return (
            <HonorCard
              key={ea.summonerId}
              eligiblePlayer={ea}
              amountVote={honorData.votePool.votes}
              honoredPlayers={honorData.honoredPlayers}
            />
          );
        })}
      </Stack>
    );
  };

  const onClickPlayAgain = () => {
    makeRequest('POST', '/lol-lobby/v2/play-again', undefined).then();
  };

  if (!honorData) {
    return <LoadingScreen fullArea />;
  }

  return (
    <Stack
      direction={'column'}
      justifyContent={'space-between'}
      alignItems={'center'}
      height={'100%'}
      width={'100%'}
      rowGap={2}
      p={2}
      pb={`${config.bottomBarOffset}px`}
    >
      <Stack direction={'column'} alignItems={'center'}>
        <Typography>
          {rcpFeLolHonorTrans('honor_prompted_voting_title')}
        </Typography>
        <Typography>
          {honorData.honoredPlayers.length} / {honorData.votePool.votes}
        </Typography>
      </Stack>
      {renderHonorPlayer(honorData.eligibleAllies)}
      {renderHonorPlayer(honorData.eligibleOpponents)}
      <Stack direction={'column'} alignItems={'center'}>
        <CustomButton onClick={onClickPlayAgain} variant={'contained'}>
          {rcpFeLolPostgameTrans('career_postgame_button_play_again')}
        </CustomButton>
      </Stack>
    </Stack>
  );
};
