import { Stack, Typography } from '@mui/material';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useEffect, useState } from 'react';
import { LolHonorV2V1Ballot } from '@shared/typings/lol/response/lolHonorV2V1Ballot';
import { LoadingScreen } from '@render/components/LoadingScreen';
import {
  HonorCardContainer,
  HonorCard,
} from '@render/layouts/Lobby/PreEndGame/HonorCard';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { CustomButton } from '@render/components/input';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';

export const PreEndGame = () => {
  const { rcpFeLolHonor, rcpFeLolPostgame } = useLeagueTranslate();
  const { makeRequest } = useLeagueClientRequest();

  const rcpFeLolHonorTrans = rcpFeLolHonor('trans');
  const rcpFeLolPostgameTrans = rcpFeLolPostgame('trans');

  const [honorData, setHonorData] = useState<LolHonorV2V1Ballot>();
  const [playersData, setPlayersData] = useState<LolSummonerV1Summoners_Id[]>(
    [],
  );

  useLeagueClientEvent('/lol-honor-v2/v1/ballot', (data) => {
    setHonorData(data);
  });

  const getSummonerName = (summonerId: number) => {
    return playersData.find((p) => p.summonerId === summonerId)?.gameName ?? '';
  };

  const onClickPlayAgain = () => {
    makeRequest('POST', '/lol-lobby/v2/play-again', undefined).then();
  };

  useEffect(() => {
    if (!honorData) return;
    const ids = [
      ...honorData.eligibleAllies.map((p) => p.summonerId),
      ...honorData.eligibleOpponents.map((p) => p.summonerId),
    ];
    makeRequest(
      'GET',
      buildEventUrl(
        '/lol-summoner/v2/summoners?ids={digits}',
        JSON.stringify(ids),
      ),
      undefined,
    ).then((res) => {
      if (res.ok) {
        setPlayersData(res.body);
      }
    });
  }, [honorData]);

  if (!honorData || !playersData.length) {
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
    >
      <Stack direction={'column'} alignItems={'center'}>
        <Typography>
          {rcpFeLolHonorTrans('honor_prompted_voting_title')}
        </Typography>
        <Typography>
          {honorData.honoredPlayers.length} / {honorData.votePool.votes}
        </Typography>
      </Stack>
      <HonorCardContainer>
        {honorData.eligibleAllies.map((ea) => (
          <HonorCard
            key={ea.summonerId}
            eligiblePlayer={ea}
            amountVote={honorData.votePool.votes}
            honoredPlayers={honorData.honoredPlayers}
            summonerName={getSummonerName(ea.summonerId)}
          />
        ))}
      </HonorCardContainer>
      <HonorCardContainer>
        {honorData.eligibleOpponents.map((ea) => (
          <HonorCard
            key={ea.summonerId}
            eligiblePlayer={ea}
            amountVote={honorData.votePool.votes}
            honoredPlayers={honorData.honoredPlayers}
            summonerName={getSummonerName(ea.summonerId)}
          />
        ))}
      </HonorCardContainer>
      <Stack direction={'column'} alignItems={'center'}>
        <CustomButton onClick={onClickPlayAgain} variant={'contained'}>
          {rcpFeLolPostgameTrans('career_postgame_button_play_again')}
        </CustomButton>
      </Stack>
    </Stack>
  );
};
