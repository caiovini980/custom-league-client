import { Box, Stack, Typography } from '@mui/material';
import CustomDialog, {
  CustomDialogCloseFloatingButton,
} from '@render/components/CustomDialog';
import { CustomButton } from '@render/components/input';
import { useVersionContext } from '@render/layouts/BottomBar/Version/VersionContext';
import { marked } from 'marked';
import { alpha } from '@mui/material/styles';
import { formatOnlyDate } from '@shared/utils/date.util';

export const VersionModal = () => {
  const {
    closeModal,
    isModalOpen,
    checkUpdate,
    quitAndInstallUpdate,
    versionInfo,
    updateStatus,
    progress,
  } = useVersionContext();

  return (
    <CustomDialog
      open={isModalOpen}
      maxWidth={'md'}
      fullWidth
      actionsComponent={<div />}
      dialogContentProps={{
        sx: {
          p: 0,
          display: 'flex',
          background: 'var(--mui-palette-background-paper)',
        },
      }}
    >
      <CustomDialogCloseFloatingButton handleClose={closeModal} />
      <Stack
        direction={'column'}
        alignItems={'center'}
        gap={1}
        width={'100%'}
        overflow={'auto'}
      >
        <Stack
          direction={'column'}
          height={'100%'}
          width={'100%'}
          overflow={'auto'}
        >
          <Typography fontSize={'3rem'} textAlign={'center'}>
            Changelog
          </Typography>
          {versionInfo?.releases
            .filter((r) => !r.draft)
            .map((release) => {
              return (
                <Stack
                  key={release.id}
                  direction={'column'}
                  borderBottom={'1px solid var(--mui-palette-divider)'}
                  mb={3}
                >
                  <Stack direction={'row'} alignItems={'center'} columnGap={1}>
                    <Typography variant={'h4'} ml={1}>
                      {release.tag_name}
                    </Typography>
                    <Typography fontSize={'0.8rem'} color={'textSecondary'}>
                      ({formatOnlyDate(release.published_at)})
                    </Typography>
                  </Stack>
                  <Box
                    dangerouslySetInnerHTML={{ __html: marked(release.body) }}
                  />
                </Stack>
              );
            })}
        </Stack>
        <Stack
          direction={'column'}
          p={1}
          width={'100%'}
          rowGap={1}
          alignItems={'center'}
          justifyContent={'center'}
          sx={{
            position: 'relative',
            '&::before': {
              content: "''",
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width:
                updateStatus === 'downloading' ? `${progress.percent}%` : 0,
              backgroundColor: (t) => alpha(t.palette.secondary.main, 0.3),
              transition: (t) => t.transitions.create('width'),
            },
          }}
        >
          {['updated', 'checking'].includes(updateStatus) && (
            <CustomButton
              variant={'contained'}
              onClick={checkUpdate}
              loading={updateStatus === 'checking'}
            >
              Check for updates
            </CustomButton>
          )}
          {updateStatus === 'available' && (
            <>
              <Typography>Update is Available!</Typography>
              <CustomButton
                variant={'contained'}
                onClick={quitAndInstallUpdate}
              >
                Quit and Install Update
              </CustomButton>
            </>
          )}
          {updateStatus === 'downloading' && (
            <>
              <Typography>Downloading update</Typography>
              <Stack direction={'row'} columnGap={0.5}>
                <Typography>{progress.percent}%</Typography>
                <Typography>
                  ( {Math.floor(progress.bytesPerSecond / 1000000).toFixed(1)}{' '}
                  MB/s )
                </Typography>
              </Stack>
            </>
          )}
        </Stack>
      </Stack>
    </CustomDialog>
  );
};
