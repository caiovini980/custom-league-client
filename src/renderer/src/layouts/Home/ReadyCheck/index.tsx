import { Stack, StackProps, Typography } from '@mui/material';
import { CustomButton } from '@render/components/input';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { AutoAcceptCheckBox } from '@render/layouts/Home/ReadyCheck/AutoAcceptCheckBox';
import { LowPriorityModal } from '@render/layouts/Home/ReadyCheck/LowPriorityModal';
import { PartyTypeStatus } from '@render/layouts/Home/ReadyCheck/PartyTypeStatus';
import { ReadyCheckModal } from '@render/layouts/Home/ReadyCheck/ReadyCheckModal';
import { TimeInQueue } from '@render/layouts/Home/ReadyCheck/TimeInQueue';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { secondsToDisplayTime } from '@shared/utils/date.util';
import { useCallback } from 'react';

export const ReadyCheck = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolParties } = useLeagueTranslate();

  const { rcpFeLolPartiesTrans } = rcpFeLolParties;

  const phase = lobbyStore.gameFlow.use((s) => s?.phase ?? 'None');
  const currentQueueName = lobbyStore.currentQueueName.use();
  const searchState = lobbyStore.matchMaking.use((s) => s?.searchState);
  const estimatedQueueTime = lobbyStore.matchMaking.use(
    (s) => s?.estimatedQueueTime ?? 0,
  );

  useLeagueClientEvent('/lol-matchmaking/v1/search', (data) => {
    lobbyStore.matchMaking.set(data);
  });

  const onQuitMatchmaking = useCallback(() => {
    makeRequest(
      'DELETE',
      '/lol-lobby/v2/lobby/matchmaking/search',
      undefined,
    ).then();
  }, []);

  if (['None', 'InProgress', 'ChampSelect', 'GameStart'].includes(phase)) {
    return null;
  }

  if (searchState !== undefined && searchState !== 'Error') {
    return (
      <StackBox>
        <Typography fontSize={'0.7rem'}>
          {`${rcpFeLolPartiesTrans('parties_game_search_finding_match')}... (${rcpFeLolPartiesTrans('parties_game_search_estimated_time')} ${secondsToDisplayTime(estimatedQueueTime)})`}
        </Typography>
        <TimeInQueue />
        <CustomButton variant="contained" onClick={onQuitMatchmaking}>
          {rcpFeLolPartiesTrans('parties_button_quit_matchmaking')}
        </CustomButton>
        <AutoAcceptCheckBox />
        <ReadyCheckModal />
        <LowPriorityModal onQuitMatchmaking={onQuitMatchmaking} />
      </StackBox>
    );
  }

  return (
    <StackBox>
      <PartyTypeStatus />
      <Typography>{currentQueueName}</Typography>
      <AutoAcceptCheckBox />
    </StackBox>
  );
};

const StackBox = (props: StackProps) => {
  return (
    <Stack
      direction={'column'}
      p={1}
      borderBottom={'1px solid var(--mui-palette-divider)'}
      {...props}
    />
  );
};
