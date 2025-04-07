import { CircularProgress, Stack, Typography } from '@mui/material';
import CustomDialog from '@render/components/CustomDialog';
import { CustomButton } from '@render/components/input';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { sortBy } from 'lodash';
import { useState } from 'react';

interface ErrorModal {
  eventName: string;
  priority: number;
  msg: string;
  mode: 'loading' | 'fatal-error';
}

export const LeagueClientEvent = () => {
  const [errors, setErrors] = useState<ErrorModal[]>([]);

  const addError = (err: ErrorModal) => {
    setErrors((prev) => [...prev, err]);
  };

  const removeError = (eventName: string) => {
    setErrors((prev) => prev.filter((e) => e.eventName !== eventName));
  };

  useLeagueClientEvent('all', (data, event) => {
    console.log(event, data);
  });

  useLeagueClientEvent('/riot-messaging-service/v1/state', (state, event) => {
    if (state === 'Connected') {
      removeError(event);
    }
    if (state === 'Disconnected') {
      addError({
        eventName: event,
        mode: 'loading',
        msg: 'Retrying connection...',
        priority: 1,
      });
    }
  });

  useLeagueClientEvent('/lol-vanguard/v1/session', (state, event) => {
    if (state.state !== 'ERROR') {
      removeError(event);
    } else {
      addError({
        eventName: event,
        msg: `Vanguard Error: ${state.vanguardStatus}`,
        mode: 'fatal-error',
        priority: 2,
      });
    }
  });

  const { msg, mode } = ((): ErrorModal => {
    const err = sortBy(errors, (e) => e.priority);
    if (err.length) return err[0];
    return {
      eventName: '',
      priority: -1,
      msg: '',
      mode: 'loading',
    };
  })();

  return (
    <CustomDialog
      title={'Error'}
      open={!!errors.length}
      handleClose={() => console.log('')}
      hiddenBtnCancel
      hiddenBtnConfirm
      maxWidth={'xs'}
      fullWidth
    >
      <Stack
        justifyContent={'center'}
        alignItems={'center'}
        width={'100%'}
        rowGap={2}
      >
        <Typography textAlign={'center'}>{msg}</Typography>
        {mode === 'loading' && <CircularProgress />}
        {mode === 'fatal-error' && (
          <>
            <Typography>Need restart client</Typography>
            <CustomButton variant={'contained'}>Close client</CustomButton>
          </>
        )}
      </Stack>
    </CustomDialog>
  );
};
