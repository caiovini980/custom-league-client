import { Box, Drawer, IconButton, Paper, Stack } from '@mui/material';
import { AppConfig } from '@render/layouts/BottomBar/AppConfig';
import {
  electronListen,
  useElectronHandle,
} from '@render/utils/electronFunction.util';
import { useEffect, useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { Updater } from '@render/layouts/Updater';
import { appConfigStore } from '@render/zustand/stores/appConfigStore';
import { useAudioManager } from '@render/hooks/useAudioManager';

export const BottomBar = () => {
  const { play } = useAudioManager();
  const { appConfig } = useElectronHandle();

  const loadConfig = () => {
    appConfig.getConfig().then((config) => {
      appConfigStore.set(config);
    });
  };

  const [open, setOpen] = useState({
    open: false,
    screen: 'config',
  });

  const openDrawer = (screen: string) => {
    play('open_settings');
    setOpen({
      open: true,
      screen,
    });
  };

  const closeDrawer = () => {
    play('open_settings');
    setOpen((prevState) => ({ ...prevState, open: false }));
  };

  useEffect(() => {
    electronListen.onChangeAppConfig((config) => {
      appConfigStore.set(config);
    });
    loadConfig();
  }, []);

  return (
    <Paper>
      <Stack
        direction={'row'}
        columnGap={2}
        justifyContent={'flex-end'}
        height={30}
        width={'100%'}
        p={0.5}
      >
        <Updater />
        <IconButton size={'small'} onClick={() => openDrawer('config')}>
          <FaCog size={14} />
        </IconButton>
      </Stack>
      <Drawer anchor={'right'} open={open.open} onClose={closeDrawer}>
        <Box width={280}>{open.screen === 'config' && <AppConfig />}</Box>
      </Drawer>
    </Paper>
  );
};
