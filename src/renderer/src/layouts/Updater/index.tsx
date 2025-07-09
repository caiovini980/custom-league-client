import { ButtonBase, LinearProgress, Stack, Typography } from '@mui/material';
import CustomDialog, {
  CustomDialogCloseFloatingButton,
} from '@render/components/CustomDialog';
import { CustomButton } from '@render/components/input';
import {
  useElectronHandle,
  useElectronListen,
} from '@render/utils/electronFunction.util';
import { ProgressInfo } from 'electron-updater';
import { useEffect, useState } from 'react';

type UpdateStatus = 'checking' | 'downloading' | 'updated' | 'available';

export const Updater = () => {
  const { updater } = useElectronHandle();

  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>('updated');
  const [progressInfo, setProgressInfo] = useState<ProgressInfo>();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    updater.check().then((hasUpdate) => {
      setUpdateStatus(hasUpdate ? 'downloading' : 'updated');
    });
  }, []);

  useElectronListen('onDownloadingUpdate', (data) => {
    setUpdateStatus('downloading');
    setProgressInfo(data);
  });

  useElectronListen('onUpdateComplete', () => {
    setUpdateStatus('available');
  });

  const onClickQuit = () => {
    updater.quitAndInstallUpdate();
  };

  const percent = Math.floor(progressInfo?.percent ?? 0);

  const updateComponent = (isModal = false) => {
    return (
      <Stack
        direction={isModal ? 'column' : 'row'}
        alignItems={'center'}
        gap={1}
        sx={{
          '&  p': {
            fontSize: isModal ? '1rem' : '0.7rem',
          },
        }}
      >
        <Typography>Downloading update:</Typography>
        <Stack
          direction={'row'}
          alignItems={'center'}
          columnGap={1}
          width={isModal ? 260 : 120}
        >
          <LinearProgress
            sx={{
              width: '100%',
            }}
            variant={progressInfo ? 'determinate' : 'indeterminate'}
            value={percent}
          />
          <Typography>{percent}%</Typography>
        </Stack>
      </Stack>
    );
  };

  if (updateStatus === 'updated') return null;

  return (
    <>
      <Stack
        direction={'row'}
        alignItems={'center'}
        columnGap={1}
        component={ButtonBase}
        onClick={() => setOpenModal(true)}
        sx={{
          '& > p': {
            fontSize: '0.7rem',
          },
        }}
      >
        {updateStatus === 'available' && (
          <Typography>Update Available</Typography>
        )}
        {updateStatus === 'downloading' && updateComponent()}
      </Stack>
      <CustomDialog
        title={'Updater'}
        open={openModal}
        actionsComponent={<div />}
      >
        {updateStatus === 'downloading' && updateComponent(true)}
        {updateStatus === 'available' && (
          <Stack direction={'column'} alignItems={'center'} rowGap={2}>
            <Typography>Download complete. Click to install</Typography>
            <CustomButton variant={'outlined'} onClick={onClickQuit}>
              Quit And Install update
            </CustomButton>
          </Stack>
        )}
        <CustomDialogCloseFloatingButton
          handleClose={() => setOpenModal(false)}
        />
      </CustomDialog>
    </>
  );
};
