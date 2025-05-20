import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useElectronHandle } from '@render/utils/electronFunction.util';
import { storeActions, useStore } from '@render/zustand/store';
import { GetAppConfigResponse } from '@shared/typings/ipc-function/handle/app-config.typing';
import { CustomCheckBox } from '@render/components/input';

export const AppConfig = () => {
  const { appConfig, client } = useElectronHandle();
  const config = useStore().leagueClient.appConfig();
  const isClientOpen = useStore().leagueClient.isClientOpen();

  const onClickChangeRiotPath = () => {
    appConfig.setConfig({
      name: 'RIOT_CLIENT_PATH',
      value: null,
    });
  };

  const onClickToggleClient = () => {
    storeActions.leagueClient.isClientOpen(!isClientOpen);
    client.changeShowClient(!isClientOpen);
  };

  const onClickReloadGameData = () => {
    client.reloadGameData();
  };

  const getConfig = (key: keyof GetAppConfigResponse) => {
    return config?.[key] ?? '-';
  };

  const btn = [
    {
      primaryText: 'Change Riot Client Path',
      secondaryText: getConfig('RIOT_CLIENT_PATH'),
      onClick: onClickChangeRiotPath,
    },
    {
      primaryText: 'Toggle Show Client',
      onClick: onClickToggleClient,
      toggle: isClientOpen,
    },
    {
      primaryText: 'Reload Game Data',
      onClick: onClickReloadGameData,
    },
  ];

  return (
    <List>
      {btn.map((b) => (
        <ListItem key={b.primaryText} disablePadding>
          <ListItemButton onClick={b.onClick}>
            <ListItemText primary={b.primaryText} secondary={b.secondaryText} />
            {b.toggle !== undefined && <CustomCheckBox checked={b.toggle} />}
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
