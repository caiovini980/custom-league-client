import { CustomButton } from '@render/components/input';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';
import { electronHandle } from '@render/utils/electronFunction.util';
import { useEffect } from 'react';

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

  const { rcpFeLolChampSelectTrans } = rcpFeLolChampSelect;

  useEffect(() => {
    if (isPlayerAction) {
      electronHandle.client.priorityApp();
    }
  }, [isPlayerAction]);

  const onClickActionButton = () => {
    let actionId = pickPlayerActionId;
    let championId = currentPlayer.championPickIntent;
    if (currentAction === 'ban') {
      actionId = banPlayerActionId;
      championId = bans.banIntentChampionId;
    }

    makeRequest(
      'PATCH',
      buildEventUrl('/lol-champ-select/v1/session/actions/{digits}', actionId),
      {
        completed: true,
        championId,
      },
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
      return currentPlayer.championPickIntent === 0;
    }
    return false;
  };

  if (session.allowRerolling) return null;

  if (!isPlayerAction) return null;

  return (
    <CustomButton
      variant={'contained'}
      onClick={onClickActionButton}
      disabled={disabledActionButton()}
      sx={{
        flexShrink: 0,
        fontSize: '1.5rem',
      }}
    >
      {getButtonLabel()}
    </CustomButton>
  );
};
