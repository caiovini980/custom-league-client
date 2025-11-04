import { Box, Paper, Stack } from '@mui/material';
import { AppConfigModal } from '@render/layouts/BottomBar/AppConfigModal';
import { CloseClient } from '@render/layouts/BottomBar/CloseClient';
import { ShowClient } from '@render/layouts/BottomBar/ShowClient';
import { Version } from '@render/layouts/BottomBar/Version/Version';
import { VolumeBarShortcut } from '@render/layouts/BottomBar/VolumeBarShortcut';

export const BottomBar = () => {
  const iconSize = 16;

  return (
    <Paper>
      <Stack
        direction={'row'}
        columnGap={3}
        justifyContent={'space-between'}
        height={40}
        width={'100%'}
        px={0.5}
      >
        <Version />
        <Box flexGrow={1} />
        <Stack
          direction={'row'}
          alignItems={'center'}
          columnGap={1}
          p={0.5}
          sx={{
            '& .MuiIconButton-root': {
              p: 1,
            },
            '& svg': {
              width: iconSize,
              height: iconSize,
            },
          }}
        >
          <CloseClient />
          <ShowClient />
          <VolumeBarShortcut />
          <AppConfigModal />
        </Stack>
      </Stack>
    </Paper>
  );
};
