import { Box, ButtonBase, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { CentralizedStack } from '@render/components/CentralizedStack';
import CustomDialog, {
  CustomDialogCloseFloatingButton,
} from '@render/components/CustomDialog';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { electronHandle } from '@render/utils/electronFunction.util';
import { GetPatchNotesResponse } from '@shared/typings/ipc-function/handle/client.typing';
import { useEffect, useState } from 'react';

export const PatchNotes = () => {
  const [openPatchNotesModal, setOpenPatchNotesModal] = useState(false);
  const [patchNotes, setPatchNotes] = useState<GetPatchNotesResponse>();

  useEffect(() => {
    electronHandle.client.getPatchNotes().then((data) => {
      setPatchNotes(data);
    });
  }, []);

  if (!patchNotes)
    return (
      <CentralizedStack>
        <LoadingScreen />
      </CentralizedStack>
    );

  return (
    <>
      <Stack
        direction={'column'}
        component={ButtonBase}
        onClick={() => setOpenPatchNotesModal(true)}
        justifyContent={'flex-end'}
        alignItems={'unset'}
        width={'100%'}
        height={'100%'}
        sx={{
          background: `url(${patchNotes.img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Stack
          direction={'column'}
          sx={{
            p: 1,
            background: (t) => alpha(t.palette.common.black, 0.7),
            '& p': {
              color: 'var(--mui-palette-common-white)',
            },
          }}
        >
          <Typography fontSize={'1.8rem'}>{patchNotes.title}</Typography>
          <Typography fontSize={'1.2rem'}>{patchNotes.description}</Typography>
        </Stack>
      </Stack>
      <CustomDialog
        open={openPatchNotesModal}
        maxWidth={'xl'}
        fullWidth
        actionsComponent={<div />}
        dialogContentProps={{
          sx: { p: 0, height: '80vh', overflow: 'hidden' },
        }}
      >
        <CustomDialogCloseFloatingButton
          colorScheme={'light'}
          handleClose={() => setOpenPatchNotesModal(false)}
        />
        <Box
          component={'iframe'}
          src={patchNotes.urlEmbed}
          sx={{
            p: 0,
            border: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </CustomDialog>
    </>
  );
};
