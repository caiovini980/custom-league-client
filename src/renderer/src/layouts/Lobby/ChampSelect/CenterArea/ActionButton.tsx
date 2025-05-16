import { CustomButton } from '@render/components/input';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';

export const ActionButton = () => {
  const { makeRequest } = useLeagueClientRequest();
  const {
    session,
    currentAction,
    banPlayerActionId,
    pickPlayerActionId,
    isPlayerAction,
    currentPlayer,
    bans,
  } = useChampSelectContext();
  const { rcpFeLolChampSelect } = useLeagueTranslate();

  const rcpFeLolChampSelectTrans = rcpFeLolChampSelect('trans');

  const onClickReRoll = () => {
    makeRequest(
      'POST',
      '/lol-champ-select/v1/session/my-selection/reroll',
      undefined,
    ).then();
  };

  const onClickActionButton = () => {
    let actionId = pickPlayerActionId;
    if (currentAction === 'ban') actionId = banPlayerActionId;

    makeRequest(
      'POST',
      buildEventUrl(
        '/lol-champ-select/v1/session/actions/{digits}/complete',
        actionId,
      ),
      {} as unknown as undefined,
    ).then();
  };

  const getButtonLabel = () => {
    if (currentAction === 'ban') {
      return rcpFeLolChampSelectTrans('ban_button');
    }
    if (currentAction === 'pick') {
      return rcpFeLolChampSelectTrans('lock_in');
    }
    return '';
  };

  const disabledActionButton = () => {
    if (currentAction === 'ban') {
      return bans.banIntentChampionId === 0;
    }
    if (currentAction === 'pick') {
      return currentPlayer.championId === 0;
    }
    return false;
  };

  if (session.allowRerolling) {
    return (
      <CustomButton
        variant={'contained'}
        onClick={onClickReRoll}
        disabled={session.rerollsRemaining === 0}
      >
        {rcpFeLolChampSelectTrans('random_icon_label')}
      </CustomButton>
    );
  }

  if (!isPlayerAction) return null;

  return (
    <CustomButton
      variant={'contained'}
      onClick={onClickActionButton}
      disabled={disabledActionButton()}
    >
      {getButtonLabel()}
    </CustomButton>
  );
};
