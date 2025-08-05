import { CustomButton } from '@render/components/input';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { MatchMakingErrorModal } from '@render/layouts/Lobby/GenericLobby/MatchMakingErrorModal';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { secondsToDisplayTime } from '@shared/utils/date.util';

export const MatchMakingStats = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolParties } = useLeagueTranslate();

  const canStartActivity = lobbyStore.canStartActivity.use();
  const penaltyTimeRemaining = lobbyStore.matchMaking.use((s) => {
    if (s?.errors.length) {
      return s.errors[0].penaltyTimeRemaining;
    }
    return 0;
  });
  const isMatchMaking = lobbyStore.matchMaking.use((s) => !!s);

  const { rcpFeLolPartiesTrans } = rcpFeLolParties;

  const onClickFindMatchButton = () => {
    makeRequest(
      'POST',
      '/lol-lobby/v2/lobby/matchmaking/search',
      undefined,
    ).then();
  };

  const onClickQuitMatchmaking = () => {
    makeRequest(
      'DELETE',
      '/lol-lobby/v2/lobby/matchmaking/search',
      undefined,
    ).then();
  };

  const onClickReturnMainMenu = () => {
    makeRequest('DELETE', '/lol-lobby/v2/lobby', undefined).then();
  };

  const isDisableStartPartyBtn = () => {
    return !canStartActivity || !!penaltyTimeRemaining;
  };

  return (
    <>
      <CustomButton
        variant="contained"
        onClick={onClickFindMatchButton}
        disabled={isDisableStartPartyBtn()}
      >
        {penaltyTimeRemaining
          ? secondsToDisplayTime(penaltyTimeRemaining)
          : rcpFeLolPartiesTrans('parties_button_find_match')}
      </CustomButton>
      {!isMatchMaking ? (
        <CustomButton variant="outlined" onClick={onClickReturnMainMenu}>
          {rcpFeLolPartiesTrans('parties_button_quit')}
        </CustomButton>
      ) : (
        <CustomButton variant="outlined" onClick={onClickQuitMatchmaking}>
          {rcpFeLolPartiesTrans('parties_button_quit_matchmaking')}
        </CustomButton>
      )}
      <MatchMakingErrorModal />
    </>
  );
};
