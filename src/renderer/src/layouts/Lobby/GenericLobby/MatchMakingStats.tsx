import { CustomButton } from '@render/components/input';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { ErrorModal } from '@render/layouts/Lobby/GenericLobby/ErrorModal';
import { secondsToDisplayTime } from '@shared/utils/date.util';
import { useStore } from '@render/zustand/store';

interface MatchMakingStatsProps {
  canStartActivity: boolean;
}

export const MatchMakingStats = ({
  canStartActivity,
}: MatchMakingStatsProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolParties } = useLeagueTranslate();

  const matchMaking = useStore().lobby.matchMaking();

  const rcpFeLolPartiesTrans = rcpFeLolParties('trans');

  function onFindMatchButtonClicked() {
    makeRequest('POST', '/lol-lobby/v2/lobby/matchmaking/search', undefined);
  }

  const isDisableStartPartyBtn = () => {
    return !canStartActivity || !!matchMaking?.errors.length;
  };

  return (
    <>
      <CustomButton
        variant="contained"
        onClick={onFindMatchButtonClicked}
        disabled={isDisableStartPartyBtn()}
      >
        {matchMaking?.errors.length
          ? secondsToDisplayTime(matchMaking?.errors[0].penaltyTimeRemaining)
          : rcpFeLolPartiesTrans('parties_button_find_match')}
      </CustomButton>
      <ErrorModal errors={matchMaking?.errors ?? []} />
    </>
  );
};
