import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import { CustomButton } from '@render/components/input';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useSnackNotification } from '@render/hooks/useSnackNotification';
import { chatStore } from '@render/zustand/stores/chatStore';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { LolChallengesV1SummaryPlayerDataPlayer_Id } from '@shared/typings/lol/response/lolChallengesV1SummaryPlayerDataPlayer_Id';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';
import { useState } from 'react';

interface SummonerDetailsProps {
  summoner: LolSummonerV1Summoners_Id;
}

export const SummonerDetails = ({ summoner }: SummonerDetailsProps) => {
  const { profileIcon } = useLeagueImage();
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolSocial, rcpFeLolPostgame } = useLeagueTranslate();
  const { snackSuccess, snackError } = useSnackNotification();

  const isFriend = chatStore.friends.use((chat) =>
    chat.some((c) => c.summonerId === summoner.summonerId),
  );
  const currentSummoner = currentSummonerStore.info.use();

  const iconSize = 180;
  const levelSize = 55;
  const { rcpFeLolSocialTrans } = rcpFeLolSocial;
  const { rcpFeLolPostgameTrans } = rcpFeLolPostgame;

  const [challengeStats, setChallengeStats] =
    useState<LolChallengesV1SummaryPlayerDataPlayer_Id>();

  const isShowFriendInvite = () => {
    if (currentSummoner?.summonerId === summoner.summonerId) return false;
    return !isFriend;
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
      <Stack direction={'column'} alignItems={'flex-start'}>
        <Typography variant={'h3'}>{summoner.gameName}</Typography>
        <Typography variant={'h6'}>{challengeStats?.title.name}</Typography>
        {isShowFriendInvite() && (
          <CustomButton variant={'contained'} onClick={onClickAddFriend}>
            {rcpFeLolSocialTrans('tooltip_new_friend')}
          </CustomButton>
        )}
      </Stack>
    </Stack>
  );
};
