import { Divider, LinearProgress, Stack, Typography } from '@mui/material';
import { CustomButton } from '@render/components/input';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useTimer } from '@render/hooks/useTimer';
import { ClientEndpointKeys } from '@shared/typings/lol/clientEndpoint';
import { LolChampSelectV1OngoingPositionSwap } from '@shared/typings/lol/response/lolChampSelectV1OngoingPositionSwap';
import { useEffect } from 'react';

export interface PositionSwapProps {
  type: 'position' | 'pick_order' | 'champion';
  summonerName: string;
  swapId: number;
  swapState: string;
  actionDescription: string;
  onCompleteAction: () => void;
}

export const SwapNotification = ({
  type,
  swapId,
  swapState,
  summonerName,
  actionDescription,
  onCompleteAction,
}: PositionSwapProps) => {
  const { time, startTimer, stopAndResetTimer } = useTimer();
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolChampSelect } = useLeagueTranslate();

  const { rcpFeLolChampSelectTrans } = rcpFeLolChampSelect;

  const timeAmount = 10;

  useEffect(() => {
    if (time > timeAmount) {
      stopAndResetTimer();
      doAction('cancel');
      onCompleteAction();
    }
  }, [time]);

  useEffect(() => {
    stopAndResetTimer();
    startTimer();
    const completeActionState: string[] = [
      'ACCEPTED',
      'CANCELLED',
      'DECLINED',
      'BUSY',
    ];
    if (completeActionState.includes(swapState)) {
      setTimeout(() => {
        onCompleteAction();
      }, 1500);
    }
  }, [swapState]);

  const getTitle = () => {
    const swapStateMapper: Partial<
      Record<LolChampSelectV1OngoingPositionSwap['state'], string>
    > = {
      CANCELLED: 'pregame_swap_canceled',
      BUSY: 'pregame_swap_busy',
      RECEIVED: 'pregame_swap_requested',
      SENT: 'pregame_swap_waiting',
    };

    const titleKey = swapStateMapper[swapState];

    return titleKey ? rcpFeLolChampSelectTrans(titleKey, summonerName) : '';
  };

  const getAction = () => {
    let text = actionDescription;
    if (type === 'position') {
      text = rcpFeLolChampSelectTrans(
        `summoner_assigned_position_${actionDescription}`,
      );
    }
    return rcpFeLolChampSelectTrans(`swap_requested_${type}$html`, text);
  };

  const doAction = (action: 'decline' | 'accept' | 'cancel') => {
    const url =
      `/lol-champ-select/v1/session/${type.replace('_', '-')}-swaps/{digits}/${action}` as ClientEndpointKeys;

    makeRequest('POST', buildEventUrl(url, swapId), undefined).then();
  };

  const getButtons = () => {
    if (swapState === 'SENT') {
      return (
        <CustomButton variant={'outlined'} onClick={() => doAction('cancel')}>
          {rcpFeLolChampSelectTrans('pregame_swap_cancel')}
        </CustomButton>
      );
    }
    if (swapState === 'RECEIVED') {
      return (
        <>
          <CustomButton
            variant={'contained'}
            onClick={() => doAction('accept')}
          >
            {rcpFeLolChampSelectTrans('pregame_swap_accept')}
          </CustomButton>
          <CustomButton
            variant={'outlined'}
            onClick={() => doAction('decline')}
          >
            {rcpFeLolChampSelectTrans('pregame_swap_decline')}
          </CustomButton>
        </>
      );
    }
    return null;
  };

  return (
    <Stack
      direction={'column'}
      rowGap={1}
      position={'relative'}
      p={1}
      pb={2}
      sx={{
        '& span': {
          color: (t) => t.palette.highlight.main,
        },
      }}
    >
      <Typography textAlign={'center'} fontSize={'1.2rem'}>
        {rcpFeLolChampSelectTrans(`swap_request_title_${type}`)}
      </Typography>
      <Divider />
      <Typography fontSize={'0.8rem'} color={'textSecondary'}>
        {getTitle()}
      </Typography>
      <Typography dangerouslySetInnerHTML={{ __html: getAction() }} />
      <Stack direction={'row'} justifyContent={'space-evenly'}>
        {getButtons()}
      </Stack>
      <LinearProgress
        variant={'determinate'}
        value={100 - time * Math.floor(100 / timeAmount)}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 8,
        }}
      />
    </Stack>
  );
};
