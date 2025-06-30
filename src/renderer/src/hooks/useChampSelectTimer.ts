import { LolChampSelectV1Session } from '@shared/typings/lol/response/lolChampSelectV1Session';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useEffect, useState } from 'react';
import { ChampSelectionActions } from '@render/hooks/useChampSelect';

export const useChampSelectTimer = (
  session: LolChampSelectV1Session,
  action: ChampSelectionActions,
) => {
  const { rcpFeLolChampSelect } = useLeagueTranslate();

  const rcpFeLolChampSelectTrans = rcpFeLolChampSelect('trans');

  const [timeLeft, setTimeLeft] = useState(0);

  const setTime = (milliseconds: number) => {
    setTimeLeft(Math.floor(milliseconds / 1000));
  };

  useEffect(() => {
    const { adjustedTimeLeftInPhase, internalNowInEpochMs } = session.timer;

    const currentTime = Date.now();
    let currentTimeLeft =
      adjustedTimeLeftInPhase - (currentTime - internalNowInEpochMs);

    if (currentTimeLeft <= 0) currentTimeLeft = 0;

    setTime(currentTimeLeft);

    const interval = setInterval(() => {
      if (currentTimeLeft <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        return;
      }
      currentTimeLeft -= 10;
      setTime(currentTimeLeft);
    }, 10);

    return () => clearInterval(interval);
  }, [session.timer.adjustedTimeLeftInPhase]);

  const getTitleMessage = () => {
    switch (action) {
      case 'planning': {
        return rcpFeLolChampSelectTrans('timer_phase_ban_pick_intent_message');
      }
      case 'pick': {
        return rcpFeLolChampSelectTrans('timer_phase_ban_pick_lock_message');
      }
      case 'enemy-team-pick': {
        return rcpFeLolChampSelectTrans(
          'timer_phase_ban_pick_enemy_team_choosing_message',
        );
      }
      case 'my-team-pick': {
        return rcpFeLolChampSelectTrans(
          'timer_phase_ban_pick_allied_team_choosing_message',
        );
      }
      case 'ban': {
        return rcpFeLolChampSelectTrans('timer_phase_ban_pick_ban_message');
      }
      case 'finalization': {
        return rcpFeLolChampSelectTrans('timer_phase_finalization_message');
      }

      default: {
        return '';
      }
    }
  };
  return {
    title: getTitleMessage(),
    time: timeLeft,
  };
};
