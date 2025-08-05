import { CustomButton } from '@render/components/input';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { electronHandle } from '@render/utils/electronFunction.util';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';
import { useEffect } from 'react';

export const ActionButton = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolChampSelect } = useLeagueTranslate();

  const allowRerolling = champSelectStore.getSessionData(
    (session) => session.allowRerolling,
  );
  const banPlayerActionId = champSelectStore.currentBanActionId.use();
  const pickPlayerActionId = champSelectStore.currentPickActionId.use();
  const bans = champSelectStore.bans.use();
  const currentAction = champSelectStore.currentAction.use();
  const isPlayerAction = champSelectStore.getCurrentSummonerData(
    (s) => s.isActingNow,
    false,
  );
  const summonerChampionId = champSelectStore.getCurrentSummonerData(
    (s) => s.championId,
    0,
  );

  const { rcpFeLolChampSelectTrans } = rcpFeLolChampSelect;

  useEffect(() => {
    if (isPlayerAction) {
      electronHandle.client.priorityApp();
    }
  }, [isPlayerAction]);

  const onClickActionButton = () => {
    let actionId = pickPlayerActionId;
    let championId = summonerChampionId;
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
      return summonerChampionId === 0;
    }
    return false;
  };

  if (allowRerolling) return null;

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
