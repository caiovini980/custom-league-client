import { Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { LolLobbyV2Lobby } from '@shared/typings/lol/response/lolLobbyV2Lobby';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';
import { useEffect, useState } from 'react';
import { PositionIcon } from './PositionIcon';
import { CircularIcon } from '@render/components/CircularIcon';
import { PlayerCardMenu } from '@render/layouts/Lobby/GenericLobby/PlayerList/PlayerCardMenu';

interface PlayerCardProps {
  isLeader: boolean;
  isOwner: boolean;
  member: LolLobbyV2Lobby['members'][number];
  showPositionSelector: boolean;
}

export const PlayerCard = ({
  member,
  isOwner,
  isLeader,
  showPositionSelector,
}: PlayerCardProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { profileIcon, genericImg } = useLeagueImage();

  const [summoner, setSummoner] = useState<LolSummonerV1Summoners_Id>();

  useEffect(() => {
    makeRequest(
      'GET',
      buildEventUrl('/lol-summoner/v1/summoners/{digits}', member.summonerId),
      undefined,
    ).then((res) => {
      if (res.ok) {
        setSummoner(res.body);
      }
    });
  }, [member.summonerId]);

  return (
    <Stack
      component={Paper}
      direction={'column'}
      rowGap={1}
      p={1}
      position={'relative'}
      justifyContent={'center'}
      alignItems={'center'}
      sx={{ width: 180, opacity: member.ready ? 1 : 0.5 }}
    >
      <Box sx={{ position: 'absolute', top: 3, right: 3 }}>
        {!isOwner && (
          <PlayerCardMenu member={member} isCurrentLeader={isLeader} />
        )}
      </Box>
      <CircularIcon src={profileIcon(summoner?.profileIconId)} size={60} />
      <Stack
        direction={'row'}
        columnGap={0.5}
        alignItems={'center'}
        flexShrink={0}
      >
        <img
          alt={'icon-crown'}
          src={genericImg(
            'plugins/rcp-fe-lol-parties/global/default/icon-crown.png',
          )}
          style={{
            display: member.isLeader ? 'block' : 'none',
            height: 15,
            width: 15,
          }}
        />
        <Typography sx={{ width: '100%' }}>{summoner?.gameName}</Typography>
      </Stack>
      <Stack direction={'column'} alignItems={'center'} rowGap={2}>
        {showPositionSelector && (
          <PositionIcon member={member} isOwner={isOwner} />
        )}
        {!member.ready && <CircularProgress size={14} />}
      </Stack>
    </Stack>
  );
};
