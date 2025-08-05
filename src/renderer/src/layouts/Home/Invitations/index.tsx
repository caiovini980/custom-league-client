import { Stack, Typography } from '@mui/material';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { InvitationContainer } from '@render/layouts/Home/Invitations/InvitationContainer';
import { LolLobbyV2ReceivedInvitations } from '@shared/typings/lol/response/lolLobbyV2ReceivedInvitations';
import { useState } from 'react';

export const Invitations = () => {
  const { rcpFeLolParties } = useLeagueTranslate();

  const { rcpFeLolPartiesTrans } = rcpFeLolParties;

  const [receivedInvitations, setReceivedInvitations] = useState<
    LolLobbyV2ReceivedInvitations[]
  >([]);

  useLeagueClientEvent('/lol-lobby/v2/received-invitations', (data) => {
    setReceivedInvitations(data);
  });

  if (!receivedInvitations.length) return null;

  return (
    <Stack
      direction={'column'}
      sx={{
        p: 1,
        borderBottom: '1px solid var(--mui-palette-divider)',
      }}
    >
      <Typography mb={1.5}>
        {rcpFeLolPartiesTrans('parties_group_label_game_invites')}
      </Typography>
      {receivedInvitations.map((inv) => (
        <InvitationContainer key={inv.invitationId} invitation={inv} />
      ))}
    </Stack>
  );
};
