import { CustomButton } from '@render/components/input';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useState } from 'react';
import { LolChampSelectV1Summoners_Id } from '@shared/typings/lol/response/lolChampSelectV1Summoners_Id';
import { useChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';

export const ActionButton = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { currentCellId, session, currentPlayerAction, currentAction } =
    useChampSelectContext();
  const { rcpFeLolChampSelect } = useLeagueTranslate();

  const rcpFeLolChampSelectTrans = rcpFeLolChampSelect('trans');

  const [summonerData, setSummonerData] =
    useState<LolChampSelectV1Summoners_Id>();

  useLeagueClientEvent(
    buildEventUrl('/lol-champ-select/v1/summoners/{digits}', currentCellId),
    (data) => {
      setSummonerData(data);
    },
  );

  const onClickReRoll = () => {
    makeRequest(
      'POST',
      '/lol-champ-select/v1/session/my-selection/reroll',
      undefined,
    ).then();
  };

  const onClickActionButton = () => {
    makeRequest(
      'POST',
      buildEventUrl(
        '/lol-champ-select/v1/session/actions/{digits}/complete',
        currentPlayerAction?.id ?? '',
      ),
      undefined,
    ).then();
  };

  const getButtonLabel = () => {
    if (currentAction === 'ban') {
      return rcpFeLolChampSelectTrans('ban_button');
    }
    if (currentAction === 'pick') {
      rcpFeLolChampSelectTrans('lock_in');
    }
    return '';
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

  if (!summonerData?.isActingNow) return null;

  return (
    <CustomButton variant={'contained'} onClick={onClickActionButton}>
      {getButtonLabel()}
    </CustomButton>
  );
};
