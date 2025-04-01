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

  const getConfig = (key: keyof GetAppConfigResponse) => {
    return config?.[key] ?? '-';
  };

  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton onClick={onClickChangeRiotPath}>
          <ListItemText
            primary={'Change Riot Client Path'}
            secondary={getConfig('RIOT_CLIENT_PATH')}
          />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton onClick={onClickShowClient}>
          <ListItemText primary={'Show Client'} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton onClick={onClickCloseClient}>
          <ListItemText primary={'Close Client'} />
        </ListItemButton>
      </ListItem>
    </List>
  );
};
