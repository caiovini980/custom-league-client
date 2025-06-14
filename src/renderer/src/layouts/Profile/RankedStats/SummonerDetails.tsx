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
import { CustomButton } from '@render/components/input';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { chatStore } from '@render/zustand/stores/chatStore';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { useSnackNotification } from '@render/hooks/useSnackNotification';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';

interface SummonerDetailsProps {
  summoner: LolSummonerV1Summoners_Id;
}

export const SummonerDetails = ({ summoner }: SummonerDetailsProps) => {
  const { profileIcon } = useLeagueImage();
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolSocial, rcpFeLolPostgame } = useLeagueTranslate();
  const { snackSuccess, snackError } = useSnackNotification();

  const chat = chatStore.friends.use();
  const currentSummoner = currentSummonerStore.info.use();

  const iconSize = 180;
  const levelSize = 55;
  const rcpFeLolSocialTrans = rcpFeLolSocial('trans');
  const rcpFeLolPostgameTrans = rcpFeLolPostgame('trans');

  const [challengeStats, setChallengeStats] =
    useState<LolChallengesV1SummaryPlayerDataPlayer_Id>();

  const isShowFriendInvite = () => {
    if (currentSummoner?.summonerId === summoner.summonerId) return false;
    return !chat.some((c) => c.summonerId === summoner.summonerId);
  };

  const onClickAddFriend = () => {
    makeRequest('POST', '/lol-chat/v2/friend-requests', {
      puuid: summoner.puuid,
    }).then((res) => {
      if (res.ok) {
        snackSuccess(rcpFeLolSocialTrans('friend_request_sent_details'));
      } else {
        snackError(rcpFeLolPostgameTrans('postgame_friend_request_error'));
      }
    });
  };

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
        {isShowFriendInvite() && (
          <CustomButton variant={'outlined'} onClick={onClickAddFriend}>
            {rcpFeLolSocialTrans('tooltip_new_friend')}
          </CustomButton>
        )}
      </Stack>
    </Stack>
  );
};
