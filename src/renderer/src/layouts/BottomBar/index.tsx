import { Paper, Stack } from '@mui/material';
import { Updater } from '@render/layouts/Updater';
import { AppConfigModal } from '@render/layouts/BottomBar/AppConfigModal';
import { VolumeBarShortcut } from '@render/layouts/BottomBar/VolumeBarShortcut';
import { ShowClient } from '@render/layouts/BottomBar/ShowClient';
import { CloseClient } from '@render/layouts/BottomBar/CloseClient';
import { ThemeModeShortcut } from '@render/layouts/BottomBar/ThemeModeShortcut';
import { Conversations } from '@render/layouts/BottomBar/Conversations';

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
        <Stack direction={'row'}>
          <Conversations />
        </Stack>
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
          <Updater />
          <ThemeModeShortcut />
          <CloseClient />
          <ShowClient />
          <VolumeBarShortcut />
          <AppConfigModal />
        </Stack>
      </Stack>
    </Paper>
  );
};
