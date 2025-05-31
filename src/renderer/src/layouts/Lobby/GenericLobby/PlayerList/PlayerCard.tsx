import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { LolLobbyV2Lobby } from '@shared/typings/lol/response/lolLobbyV2Lobby';
import { LolSummonerV1Summoners_Id } from '@shared/typings/lol/response/lolSummonerV1Summoners_Id';
import { useEffect, useState } from 'react';
import { PositionIcon } from './PositionIcon';
import { CircularIcon } from '@render/components/CircularIcon';

interface PlayerCardProps {
  isOwner: boolean;
  member: LolLobbyV2Lobby['members'][number];
  showPositionSelector: boolean;
}

export const PlayerCard = ({
  member,
  isOwner,
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
    <Card sx={{ width: 240, opacity: member.ready ? 1 : 0.5 }}>
      <CardHeader
        avatar={<CircularIcon src={profileIcon(summoner?.profileIconId)} />}
        title={
          <>
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
            <Typography>{summoner?.gameName}</Typography>
          </>
        }
        subheader={summoner?.summonerLevel}
        slotProps={{
          title: {
            direction: 'row',
            alignItems: 'center',
            columnGap: 1,
            component: Stack,
          },
        }}
      />
      <CardContent
        component={Stack}
        direction={'column'}
        alignItems={'center'}
        rowGap={2}
      >
        {showPositionSelector && (
          <PositionIcon member={member} isOwner={isOwner} />
        )}
        {!member.ready && <CircularProgress size={14} />}
      </CardContent>
    </Card>
  );
};
