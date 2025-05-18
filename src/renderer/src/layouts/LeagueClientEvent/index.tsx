import { CircularProgress, Stack, Typography } from '@mui/material';
import CustomDialog from '@render/components/CustomDialog';
import { CustomButton } from '@render/components/input';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { sortBy } from 'lodash';
import { useState } from 'react';
import { LolRemedyV1RemedyNotificationsTransgression } from '@shared/typings/lol/response/lolRemedyV1RemedyNotifications';

interface ErrorModal {
  eventName: string;
  priority: number;
  msg: string;
  mode: 'warning' | 'loading' | 'fatal-error';
}

export const LeagueClientEvent = () => {
  const { rcpFeLolNavigation, rcpFeLolSocial } = useLeagueTranslate();
  const { makeRequest } = useLeagueClientRequest();

  const [errors, setErrors] = useState<ErrorModal[]>([]);

  const rcpFeLolSocialTrans = rcpFeLolSocial('trans');

  const addError = (err: ErrorModal) => {
    setErrors((prev) => [
      ...prev.filter((e) => e.eventName !== err.eventName),
      err,
    ]);
  };

  const removeError = (eventName: string) => {
    setErrors((prev) => prev.filter((e) => e.eventName !== eventName));
  };

  const closeClient = () => {
    makeRequest('POST', '/riotclient/pre-shutdown/begin', undefined);
  };

  useLeagueClientEvent('all', (data, event) => {
    const ignore = [
      'lol-clash',
      'client-config',
      'patcher',
      'lol-patcher',
      'lol-chat',
      'lol-hovercard',
      'lol-premade-voice',
      'riot-messaging-service',
      'lol-challenges',
    ];
    if (ignore.some((i) => event.includes(i))) return;
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
        priority: 0,
      });
    }
  });

  useLeagueClientEvent('/lol-shutdown/v1/notification', (state, event) => {
    if (state.reason === 'PlatformMaintenance') {
      const msg = rcpFeLolNavigation('trans')(
        state.countdown === 0
          ? 'platform_maintenance_message'
          : 'platform_maintenance_warning_message',
      );
      addError({
        eventName: event,
        msg,
        mode: state.countdown === 0 ? 'fatal-error' : 'warning',
        priority: state.countdown,
      });
    }
  });

  useLeagueClientEvent('/lol-login/v1/session', (state, event) => {
    if (!state.connected) {
      const msg = rcpFeLolNavigation('trans')(
        `login_error_${state.error.messageId}$html`,
      );
      addError({
        eventName: event,
        msg,
        mode: 'fatal-error',
        priority: 0,
      });
    }
  });

  useLeagueClientEvent(
    '/lol-remedy/v1/remedy-notifications',
    (state, event) => {
      if (state.length) {
        // TODO: check if is same payload every time
        const payload = JSON.parse(
          state[0].message,
        ) as LolRemedyV1RemedyNotificationsTransgression;

        makeRequest(
          'GET',
          buildEventUrl(
            '/lol-summoner/v1/summoner-profile?puuid={uuid}',
            payload.offenderPuuid,
          ),
          undefined,
        ).then((res) => {
          if (!res.ok) return;
          if (payload.transgressionType === 'AWAY_FROM_KEYBOARD') {
            const msg1 = rcpFeLolSocialTrans(
              `remedy_feedback_offender_${payload.transgressionType}$html`,
              '',
            );
            const msg2 = rcpFeLolSocialTrans(
              `remedy_received_notification_body_top_${payload.transgressionType}_bystander_no_remedies_received`,
            );
            addError({
              eventName: event,
              mode: 'warning',
              priority: 1,
              msg: `${msg1} ${msg2}`,
            });
          }
        });
      } else {
        removeError(eventName);
      }
    },
  );

  const { msg, mode, eventName } = ((): ErrorModal => {
    const errorMap: Record<ErrorModal['mode'], number> = {
      'fatal-error': 0,
      loading: 1,
      warning: 2,
    };
    const err = sortBy(
      errors,
      (e) => errorMap[e.mode],
      (e) => e.priority,
    );
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
      open={!!errors.length}
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
        <Typography
          textAlign={'center'}
          dangerouslySetInnerHTML={{ __html: msg }}
        />
        {mode === 'loading' && <CircularProgress />}
        {mode === 'warning' && (
          <CustomButton
            variant={'outlined'}
            onClick={() => removeError(eventName)}
          >
            Ok
          </CustomButton>
        )}
        {mode === 'fatal-error' && (
          <CustomButton variant={'outlined'} onClick={closeClient}>
            Close client
          </CustomButton>
        )}
      </Stack>
    </CustomDialog>
  );
};
