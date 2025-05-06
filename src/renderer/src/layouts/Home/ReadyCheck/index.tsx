import { Divider, Stack, StackProps, Typography } from '@mui/material';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { secondsToDisplayTime } from '@shared/utils/date.util';
import { CustomButton } from '@render/components/input';
import { storeActions, useStore } from '@render/zustand/store';
import { useLobby } from '@render/hooks/useLobby';
import { ReadyCheckModal } from '@render/layouts/Home/ReadyCheck/ReadyCheckModal';
import { LowPriorityModal } from '@render/layouts/Home/ReadyCheck/LowPriorityModal';
import { useEffect } from 'react';

export const ReadyCheck = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolParties } = useLeagueTranslate();
  const { getLobby, currentSummonerId, getQueueName, phase } = useLobby();

  const rcpFeLolPartiesTrans = rcpFeLolParties('trans');

  const matchMaking = useStore().lobby.matchMaking();
  const lobby = getLobby();

  useLeagueClientEvent('/lol-matchmaking/v1/search', (data) => {
    storeActions.lobby.matchMaking(data);
  });

  const onQuitMatchmaking = () => {
    makeRequest('DELETE', '/lol-lobby/v2/lobby/matchmaking/search', undefined);
  };

  useEffect(() => {
    if (phase !== 'Matchmaking') {
      storeActions.lobby.matchMaking(null);
    }
  }, [phase]);

  if (matchMaking && matchMaking.searchState !== 'Error') {
    return (
      <StackBox>
        <Typography fontSize={'0.7rem'}>
          {`${rcpFeLolPartiesTrans('parties_game_search_finding_match')}... (${rcpFeLolPartiesTrans('parties_game_search_estimated_time')} ${secondsToDisplayTime(matchMaking.estimatedQueueTime)})`}
        </Typography>
        <Typography fontSize={'1.5rem'} textAlign={'center'}>
          {secondsToDisplayTime(matchMaking.timeInQueue)}
        </Typography>
        <CustomButton variant="contained" onClick={onQuitMatchmaking}>
          {rcpFeLolPartiesTrans('parties_button_quit_matchmaking')}
        </CustomButton>
        <ReadyCheckModal />
        <LowPriorityModal
          currentSummonerId={currentSummonerId}
          onQuitMatchmaking={onQuitMatchmaking}
        />
      </StackBox>
    );
  }

  if (phase === 'None') {
    return <Divider />;
  }

  return (
    <StackBox>
      <Typography fontSize={'0.75rem'}>
        {rcpFeLolPartiesTrans(
          lobby?.partyType === 'open'
            ? 'parties_open_party_status_header'
            : 'parties_closed_party_status_header',
        )}
      </Typography>
      <Typography>{getQueueName()}</Typography>
    </StackBox>
  );
};

const StackBox = (props: StackProps) => {
  return (
    <Stack
      direction={'column'}
      p={1}
      border={(t) => `1px solid ${t.palette.divider}`}
      {...props}
    />
  );
};
