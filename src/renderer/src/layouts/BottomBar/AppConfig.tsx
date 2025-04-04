import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useElectronHandle } from '@render/utils/electronFunction.util';
import { useStore } from '@render/zustand/store';
import { GetAppConfigResponse } from '@shared/typings/ipc-function/handle/app-config.typing';

export const AppConfig = () => {
  const { appConfig, client } = useElectronHandle();
  const config = useStore().leagueClient.appConfig();

  const onClickChangeRiotPath = () => {
    appConfig.setConfig({
      name: 'RIOT_CLIENT_PATH',
      value: null,
    });
  };

  const onClickShowClient = () => {
    client.makeRequest({
      method: 'POST',
      uri: '/riotclient/launch-ux',
      data: undefined,
    });
  };

  const onClickCloseClient = () => {
    client.makeRequest({
      method: 'POST',
      uri: '/riotclient/kill-ux',
      data: undefined,
    });
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
      primaryText: 'Show Client',
      onClick: onClickShowClient,
    },
    {
      primaryText: 'Close Client',
      onClick: onClickCloseClient,
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
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
