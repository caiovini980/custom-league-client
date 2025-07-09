import { Stack, Typography } from '@mui/material';
import { CustomButton, CustomCheckBox } from '@render/components/input';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useLobby } from '@render/hooks/useLobby';
import { ChatGroup } from '@render/layouts/Lobby/ChatGroup';
import { MatchMakingStats } from '@render/layouts/Lobby/GenericLobby/MatchMakingStats';
import { PlayerList } from '@render/layouts/Lobby/GenericLobby/PlayerList';
import { Restriction } from '@render/layouts/Lobby/GenericLobby/Restriction';

export const Lobby = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolParties } = useLeagueTranslate();
  const { getLobby, getQueueName, canStartActivity, phase } = useLobby();

  const lobby = getLobby();
  const { rcpFeLolPartiesTrans } = rcpFeLolParties;

  const onReturnMainMenuButtonClicked = () => {
    makeRequest('DELETE', '/lol-lobby/v2/lobby', undefined).then();
  };

  const toggleOpenGroup = (isOpen: boolean) => {
    makeRequest(
      'PUT',
      '/lol-lobby/v2/lobby/partyType',
      isOpen ? 'open' : 'closed',
    ).then();
  };

  if (!lobby || phase === 'None') return;

  return (
    <Stack
      direction={'column'}
      rowGap={2}
      p={1}
      alignItems={'center'}
      justifyContent={'center'}
      width={'100%'}
      overflow={'auto'}
    >
      <Typography textAlign={'center'}>{getQueueName()}</Typography>
      <CustomCheckBox
        label={rcpFeLolPartiesTrans('parties_open_party_status_header')}
        checked={lobby.partyType === 'open'}
        onChange={toggleOpenGroup}
        disabled={!lobby.localMember.allowedToggleInvite}
      />
      <PlayerList lobby={lobby} />
      <Restriction restrictions={lobby.restrictions ?? []} />
      <MatchMakingStats canStartActivity={canStartActivity()} />
      <CustomButton variant="outlined" onClick={onReturnMainMenuButtonClicked}>
        {rcpFeLolPartiesTrans('parties_button_quit')}
      </CustomButton>
      <ChatGroup
        mucJwtDto={lobby.mucJwtDto}
        connectWhen={lobby.members.length > 1}
      />
    </Stack>
  );
};
