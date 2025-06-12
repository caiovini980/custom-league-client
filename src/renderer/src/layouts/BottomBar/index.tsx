import { Box, Drawer, IconButton, Paper, Stack } from '@mui/material';
import { AppConfig } from '@render/layouts/BottomBar/AppConfig';
import {
  electronListen,
  useElectronHandle,
} from '@render/utils/electronFunction.util';
import { storeActions } from '@render/zustand/store';
import { useEffect, useRef, useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { Updater } from '@render/layouts/Updater';
import { AudioPlayer, AudioPlayerRef } from '@render/components/AudioPlayer';

export const BottomBar = () => {
  const { appConfig } = useElectronHandle();
  const setAppConfig = storeActions.appConfig;
  const audioRef = useRef<AudioPlayerRef>(null);

  const loadConfig = () => {
    appConfig.getConfig().then((config) => {
      setAppConfig.state(() => config);
    });
  };

  const [open, setOpen] = useState({
    open: false,
    screen: 'config',
  });

  const openDrawer = (screen: string) => {
    audioRef.current?.play();
    setOpen({
      open: true,
      screen,
    });
  };

  const closeDrawer = () => {
    audioRef.current?.play();
    setOpen((prevState) => ({ ...prevState, open: false }));
  };

  useEffect(() => {
    electronListen.onChangeAppConfig((config) => {
      setAppConfig.state(() => config);
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

        <AudioPlayer path="open_settings.ogg" autoPlay={false} ref={audioRef} />

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
