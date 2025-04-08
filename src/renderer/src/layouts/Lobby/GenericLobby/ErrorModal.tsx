import { Stack, Typography } from '@mui/material';
import CustomDialog from '@render/components/CustomDialog';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useStore } from '@render/zustand/store';
import { LolMatchmakingV1Search } from '@shared/typings/lol/response/lolMatchmakingV1Search';
import { secondsToDisplayTime } from '@shared/utils/date.util';
import { useEffect, useState } from 'react';

interface ErrorModalProps {
  errors: LolMatchmakingV1Search['errors'];
}

export const ErrorModal = ({ errors }: ErrorModalProps) => {
  const { rcpFeLolParties } = useLeagueTranslate();
  const currentSummoner = useStore().currentSummoner.info();

  const [openModal, setOpenModal] = useState(false);

  const rcpFeLolPartiesTranslate = rcpFeLolParties('trans');

  useEffect(() => {
    if (errors.length > 0) {
      setOpenModal(true);
    }
  }, [errors.length]);

  const getReadyCheckFailer = (summonerId: number) => {
    if (currentSummoner?.summonerId === summonerId) {
      return rcpFeLolPartiesTranslate(
        'parties_queue_error_ready_check_failer_myself_body',
      );
    }
    return rcpFeLolPartiesTranslate(
      'parties_queue_error_ready_check_failer_other_body',
      'someone',
    );
  };

  const getMessage = (err: LolMatchmakingV1Search['errors'][number]) => {
    switch (err.message) {
      case 'READY_CHECK_FAILER': {
        return (
          <>
            <Typography textAlign={'center'}>
              {rcpFeLolPartiesTranslate('parties_ready_check_failer_timer')}
            </Typography>
            <Typography>
              {getReadyCheckFailer(err.penalizedSummonerId)}
            </Typography>
          </>
        );
      }
    }
    return;
  };

  return (
    <CustomDialog
      title={rcpFeLolPartiesTranslate('parties_queue_error_generic_header')}
      open={openModal}
      handleConfirm={() => setOpenModal(false)}
      labelBtnConfirm={'OK'}
      hiddenBtnCancel
      confirmButtonProps={{
        variant: 'outlined',
        sx: {
          width: '100%',
        },
      }}
    >
      {errors.map((e) => (
        <Stack key={e.id} direction={'column'} rowGap={2}>
          {getMessage(e)}
          <Typography textAlign={'center'}>
            {secondsToDisplayTime(e.penaltyTimeRemaining)}
          </Typography>
        </Stack>
      ))}
    </CustomDialog>
  );
};
