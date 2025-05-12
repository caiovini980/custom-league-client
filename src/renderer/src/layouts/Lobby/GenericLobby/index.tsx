import { Stack, Typography } from '@mui/material';
import { CustomButton } from '@render/components/input';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { MatchMakingStats } from '@render/layouts/Lobby/GenericLobby/MatchMakingStats';
import { PlayerList } from '@render/layouts/Lobby/GenericLobby/PlayerList';
import { Restriction } from '@render/layouts/Lobby/GenericLobby/Restriction';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useLobby } from '@render/hooks/useLobby';
import config from '@render/utils/config.util';

export const GenericLobby = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolParties } = useLeagueTranslate();
  const { getLobby, getQueueName, canStartActivity, phase } = useLobby();

  const lobby = getLobby();
  const rcpFeLolPartiesTrans = rcpFeLolParties('trans');

  function onReturnMainMenuButtonClicked() {
    makeRequest('DELETE', '/lol-lobby/v2/lobby', undefined);
  }

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
      pb={`${config.bottomBarOffset}px`}
    >
      <Typography textAlign={'center'}>{getQueueName()}</Typography>
      <PlayerList lobby={lobby} />
      <Restriction restrictions={lobby.restrictions ?? []} />
      <MatchMakingStats canStartActivity={canStartActivity()} />
      <CustomButton variant="outlined" onClick={onReturnMainMenuButtonClicked}>
        {rcpFeLolPartiesTrans('parties_button_quit')}
      </CustomButton>
    </Stack>
  );
};
