import { Stack, Typography } from '@mui/material';
import { CustomIconButton } from '@render/components/input';
import { SquareIcon } from '@render/components/SquareIcon';
import { useAudio } from '@render/hooks/useAudioManager';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useSpriteImage } from '@render/hooks/useSpriteImage';
import { gameDataStore } from '@render/zustand/stores/gameDataStore';
import { LolLobbyV2ReceivedInvitations } from '@shared/typings/lol/response/lolLobbyV2ReceivedInvitations';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa6';

interface InvitationContainerProps {
  invitation: LolLobbyV2ReceivedInvitations;
}

export const InvitationContainer = ({
  invitation,
}: InvitationContainerProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolParties } = useLeagueTranslate();
  const sfxAccept = useAudio('sfx-soc-ui-gameinvite-accept-click');
  const sfxInvite = useAudio('sfx-soc-notif-gameinvite-rcvd');

  const map = gameDataStore.mapById.get(invitation.gameConfig.mapId);
  const { rcpFeLolPartiesTrans } = rcpFeLolParties;

  const { getSprite } = useSpriteImage({
    src: `plugins/rcp-fe-lol-social/global/default/map_${map?.mapStringId.toLowerCase()}.png`,
    height: 128,
    width: 128,
  });

  const [summonerName, setSummonerName] = useState('');

  const handleAcceptInvitation = () => {
    makeRequest(
      'POST',
      buildEventUrl(
        '/lol-lobby/v2/received-invitations/{invitationId}/accept',
        invitation.invitationId,
      ),
      undefined,
    );
    sfxAccept.play();
  };

  const handleDeclineInvitation = () => {
    makeRequest(
      'POST',
      buildEventUrl(
        '/lol-lobby/v2/received-invitations/{invitationId}/decline',
        invitation.invitationId,
      ),
      undefined,
    );
  };

  useEffect(() => {
    makeRequest(
      'GET',
      buildEventUrl(
        '/lol-summoner/v1/summoners/{digits}',
        invitation.fromSummonerId,
      ),
      undefined,
    ).then((res) => {
      setSummonerName(res.body.gameName);
    });
  }, [invitation.fromSummonerId]);

  useEffect(() => {
    sfxInvite.play();
  }, []);

  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      columnGap={1}
    >
      <SquareIcon src={getSprite(invitation.canAcceptInvitation ? 0 : 1)} />
      <Stack direction={'column'} mr={1} flexGrow={1}>
        <Typography>{summonerName}</Typography>
        {invitation.canAcceptInvitation ? (
          <>
            <Typography fontSize={'0.7rem'} color={'textSecondary'}>
              {map?.name}
            </Typography>
            <Typography fontSize={'0.7rem'} color={'textSecondary'}>
              {gameDataStore.queueNameById.get(invitation.gameConfig.queueId)}
            </Typography>
          </>
        ) : (
          <Typography fontSize={'0.7rem'} color={'textSecondary'}>
            {rcpFeLolPartiesTrans(
              'parties_queue_restriction_player_unknownrestriction',
            )}
          </Typography>
        )}
      </Stack>
      {invitation.canAcceptInvitation && (
        <CustomIconButton
          color={'primary'}
          sx={{ p: 1, border: '1px solid var(--mui-palette-primary-main)' }}
          onClick={handleAcceptInvitation}
        >
          <FaCheck size={18} />
        </CustomIconButton>
      )}
      <CustomIconButton sx={{ p: 0.5 }} onClick={handleDeclineInvitation}>
        <FaTimes size={18} />
      </CustomIconButton>
    </Stack>
  );
};
