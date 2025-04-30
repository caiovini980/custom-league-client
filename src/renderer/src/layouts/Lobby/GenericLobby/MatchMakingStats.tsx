import { LinearProgress, Typography } from '@mui/material';
import CustomDialog from '@render/components/CustomDialog';
import { CustomButton } from '@render/components/input';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { ErrorModal } from '@render/layouts/Lobby/GenericLobby/ErrorModal';
import { LolMatchmakingV1ReadyCheck } from '@shared/typings/lol/response/lolMatchmakingV1ReadyCheck';
import { LolMatchmakingV1Search } from '@shared/typings/lol/response/lolMatchmakingV1Search';
import { secondsToDisplayTime } from '@shared/utils/date.util';
import { useState } from 'react';

interface MatchMakingStatsProps {
  canStartActivity: boolean;
}

export const MatchMakingStats = ({
  canStartActivity,
}: MatchMakingStatsProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolParties } = useLeagueTranslate();

  const [matchMaking, setMatchMaking] = useState<LolMatchmakingV1Search>();
  const [matchReadyCheck, setMatchReadyCheck] =
    useState<LolMatchmakingV1ReadyCheck>();

  const partiesTranslate = rcpFeLolParties('trans');

  useLeagueClientEvent('/lol-matchmaking/v1/search', (data) => {
    setMatchMaking(data);
  });

  useLeagueClientEvent('/lol-matchmaking/v1/ready-check', (data) => {
    setMatchReadyCheck(data);
  });

  function onFindMatchButtonClicked() {
    makeRequest('POST', '/lol-lobby/v2/lobby/matchmaking/search', undefined);
  }

  function onReturnMainMenuButtonClicked() {
    makeRequest(
      'DELETE',
      '/lol-lobby/v2/lobby/matchmaking/search',
      undefined,
    ).then(() => {
      //TODO: improvement this
      setTimeout(() => {
        setMatchMaking(undefined);
      }, 500);
    });
  }

  const onClickGameAccept = () => {
    makeRequest('POST', '/lol-matchmaking/v1/ready-check/accept', undefined);
  };

  const onClickGameDecline = () => {
    makeRequest('POST', '/lol-matchmaking/v1/ready-check/decline', undefined);
  };

  const isDisableStartPartyBtn = () => {
    return !canStartActivity || !!matchMaking?.errors.length;
  };

  if (matchMaking && matchMaking.searchState !== 'Error' && !canStartActivity) {
    return (
      <>
        <Typography>
          {`${partiesTranslate('parties_game_search_finding_match')}... (${partiesTranslate('parties_game_search_estimated_time')} ${secondsToDisplayTime(matchMaking.estimatedQueueTime)})`}
        </Typography>
        <Typography>{secondsToDisplayTime(matchMaking.timeInQueue)}</Typography>
        <CustomButton
          variant="contained"
          onClick={onReturnMainMenuButtonClicked}
        >
          Stop search
        </CustomButton>
        <CustomDialog
          maxWidth={'sm'}
          fullWidth
          title={'Party Found'}
          open={matchReadyCheck?.state === 'InProgress'}
          handleConfirm={onClickGameAccept}
          handleClose={onClickGameDecline}
          labelBtnCancel={'Decline'}
          labelBtnConfirm={'Accept'}
          confirmButtonProps={{
            disabled: matchReadyCheck?.playerResponse !== 'None',
          }}
          cancelButtonProps={{
            disabled: matchReadyCheck?.playerResponse !== 'None',
          }}
        >
          <LinearProgress
            variant={'determinate'}
            value={(matchReadyCheck?.timer ?? 0) * 10}
            sx={{
              width: '100%',
            }}
          />
        </CustomDialog>
      </>
    );
  }

  return (
    <>
      <CustomButton
        variant="contained"
        onClick={onFindMatchButtonClicked}
        disabled={isDisableStartPartyBtn()}
      >
        {matchMaking?.errors.length
          ? secondsToDisplayTime(matchMaking?.errors[0].penaltyTimeRemaining)
          : 'Find Match'}
      </CustomButton>
      <ErrorModal errors={matchMaking?.errors ?? []} />
    </>
  );
};
