import { Stack, Typography } from '@mui/material';
import { useTimer } from '@render/hooks/useTimer';
import { useEffect } from 'react';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';

export const Timer = () => {
  const { rcpFeLolChampSelect } = useLeagueTranslate();
  const { session, currentAction } = useChampSelectContext();
  const { time, startTimer, stopAndResetTimer } = useTimer();

  const rcpFeLolChampSelectTrans = rcpFeLolChampSelect('trans');

  useEffect(() => {
    stopAndResetTimer();
    startTimer();
  }, [session.timer.adjustedTimeLeftInPhase]);

  const getTime = () => {
    const timeLeft =
      Math.floor(session.timer.adjustedTimeLeftInPhase / 1000) - time;
    if (timeLeft < 0) return 0;
    return timeLeft;
  };

  const getTitleMessage = () => {
    switch (currentAction) {
      case 'planning': {
        return rcpFeLolChampSelectTrans('timer_phase_ban_pick_intent_message');
      }
      case 'pick': {
        return rcpFeLolChampSelectTrans('timer_phase_ban_pick_lock_message');
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

  return (
    <Stack direction={'column'} alignItems={'center'} justifyContent={'center'}>
      <Typography fontSize={'2.0rem'} lineHeight={1}>
        {getTitleMessage()}
      </Typography>
      <Typography fontSize={'1.8rem'} lineHeight={1}>
        {getTime()}
      </Typography>
    </Stack>
  );
};
