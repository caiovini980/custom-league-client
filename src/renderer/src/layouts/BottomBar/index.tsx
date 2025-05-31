import { Box, Drawer, IconButton, Paper, Stack } from '@mui/material';
import { AppConfig } from '@render/layouts/BottomBar/AppConfig';
import {
  electronListen,
  useElectronHandle,
} from '@render/utils/electronFunction.util';
import { storeActions } from '@render/zustand/store';
import { useEffect, useState } from 'react';
import { FaCog } from 'react-icons/fa';

export const BottomBar = () => {
  const { appConfig } = useElectronHandle();
  const setAppConfig = storeActions.leagueClient.appConfig;

  const loadConfig = () => {
    appConfig.getConfig().then((config) => {
      setAppConfig(config);
    });
  };

  const [open, setOpen] = useState({
    open: false,
    screen: 'config',
  });

  const openDrawer = (screen: string) => {
    setOpen({
      open: true,
      screen,
    });
  };

  const closeDrawer = () => {
    setOpen((prevState) => ({ ...prevState, open: false }));
  };

  useEffect(() => {
    electronListen.onChangeAppConfig((config) => {
      setAppConfig(config);
    });
    loadConfig();
  }, []);

  return (
    <Paper>
      <Stack
        direction={'row'}
        justifyContent={'flex-end'}
        height={30}
        width={'100%'}
        p={0.5}
      >
        <IconButton size={'small'} onClick={() => openDrawer('config')}>
          <FaCog size={10} />
        </IconButton>
      </Stack>
      <Drawer anchor={'right'} open={open.open} onClose={closeDrawer}>
        <Box width={250}>{open.screen === 'config' && <AppConfig />}</Box>
      </Drawer>
    </Paper>
  );
};
