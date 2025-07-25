import { Typography } from '@mui/material';
import CustomDialog from '@render/components/CustomDialog';
import { CustomIconButtonTooltip } from '@render/components/input';
import { withClientConnected } from '@render/hoc/withClientConnected';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useElectronHandle } from '@render/utils/electronFunction.util';
import { useState } from 'react';
import { FaDoorOpen } from 'react-icons/fa6';

export const CloseClient = withClientConnected(() => {
  const { rcpFeLolNavigation } = useLeagueTranslate();
  const { client } = useElectronHandle();

  const {
    rcpFeLolNavigationTransAppControls,
    rcpFeLolNavigationTransLoadingScreen,
  } = rcpFeLolNavigation;

  const [open, setOpen] = useState(false);

  const onClickCloseClient = () => {
    setOpen(false);
    client.makeRequest({
      method: 'POST',
      uri: '/process-control/v1/process/quit',
      data: undefined,
    });
  };

  return (
    <>
      <CustomIconButtonTooltip
        title={rcpFeLolNavigationTransAppControls('close_dialog_header')}
        onClick={() => setOpen(true)}
      >
        <FaDoorOpen />
      </CustomIconButtonTooltip>
      <CustomDialog
        title={rcpFeLolNavigationTransAppControls('close_dialog_header')}
        open={open}
        handleConfirm={onClickCloseClient}
        handleClose={() => setOpen(false)}
        labelBtnConfirm={rcpFeLolNavigationTransAppControls(
          'close_dialog_exit_button',
        )}
        labelBtnCancel={rcpFeLolNavigationTransLoadingScreen(
          'LOADING_SCREEN_LOGIN_QUEUE_CANCEL_QUEUE',
        )}
      >
        <Typography>
          {rcpFeLolNavigationTransAppControls('close_dialog_body')}
        </Typography>
      </CustomDialog>
    </>
  );
});
