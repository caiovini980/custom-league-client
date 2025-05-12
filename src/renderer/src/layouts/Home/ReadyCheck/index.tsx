import { Divider, Stack, StackProps, Typography } from '@mui/material';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { secondsToDisplayTime } from '@shared/utils/date.util';
import { CustomButton, CustomCheckBox } from '@render/components/input';
import { storeActions, useStore } from '@render/zustand/store';
import { useLobby } from '@render/hooks/useLobby';
import { ReadyCheckModal } from '@render/layouts/Home/ReadyCheck/ReadyCheckModal';
import { LowPriorityModal } from '@render/layouts/Home/ReadyCheck/LowPriorityModal';
import { useState } from 'react';

export const ReadyCheck = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolParties, rcpFeLolL10n } = useLeagueTranslate();
  const { getLobby, currentSummonerId, getQueueName, phase } = useLobby();

  const rcpFeLolL10nTrans = rcpFeLolL10n('trans');
  const rcpFeLolPartiesTrans = rcpFeLolParties('trans');

  const [autoAccept, setAutoAccept] = useState(false);

  const matchMaking = useStore().lobby.matchMaking();
  const lobby = getLobby();

  useLeagueClientEvent(
    '/lol-matchmaking/v1/search',
    (data) => {
      const canSetData = ['Matchmaking', 'ReadyCheck'].includes(phase);
      storeActions.lobby.matchMaking(canSetData ? data : null);
    },
    {
      deps: [phase],
    },
  );

  const onQuitMatchmaking = () => {
    makeRequest(
      'DELETE',
      '/lol-lobby/v2/lobby/matchmaking/search',
      undefined,
    ).then(() => {
      storeActions.lobby.matchMaking(null);
    });
  };

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
        <CustomCheckBox
          label={`Auto ${rcpFeLolL10nTrans('ready_check_accept_button')}`}
          checked={autoAccept}
          onChange={setAutoAccept}
        />
        <ReadyCheckModal autoAccept={autoAccept} />
        <LowPriorityModal
          currentSummonerId={currentSummonerId}
          onQuitMatchmaking={onQuitMatchmaking}
        />
      </StackBox>
    );
  }

  if (['None', 'InProgress', 'ChampSelect', 'GameStart'].includes(phase)) {
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
