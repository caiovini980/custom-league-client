import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useElectronHandle } from '@render/utils/electronFunction.util';
import { storeActions, useStore } from '@render/zustand/store';
import { GetAppConfigResponse } from '@shared/typings/ipc-function/handle/app-config.typing';
import { CustomCheckBox } from '@render/components/input';
import { useSnackNotification } from '@render/hooks/useSnackNotification';
import { useLocalTranslate } from '@render/hooks/useLocalTranslate';
import { VolumeBar } from './VolumeBar';

export const AppConfig = () => {
  const { snackError } = useSnackNotification();
  const { localTranslate } = useLocalTranslate();
  const { appConfig, client } = useElectronHandle();
  const config = useStore().leagueClient.appConfig();
  const isClientOpen = useStore().leagueClient.isClientOpen();

  const onClickChangeRiotPath = () => {
    appConfig
      .setConfig({
        name: 'RIOT_CLIENT_PATH',
        value: null,
      })
      .catch((err) => {
        if ('description' in err) {
          snackError(err.description);
        }
      });
  };

  const onClickToggleClient = () => {
    storeActions.leagueClient.isClientOpen(!isClientOpen);
    client.changeShowClient(!isClientOpen);
  };

  const onClickLightMode = () => {
    const mode = getConfig('THEME_MODE') === 'DARK' ? 'LIGHT' : 'DARK';
    appConfig.setConfig({
      name: 'THEME_MODE',
      value: mode,
    });
  };

  const onClickReloadGameData = () => {
    client.reloadGameData();
  };

  const onClickCloseClient = () => {
    client.makeRequest({
      method: 'POST',
      uri: '/process-control/v1/process/quit',
      data: undefined,
    });
  };

  const getConfig = (key: keyof GetAppConfigResponse) => {
    return config?.[key] ?? '-';
  };

  const btn = [
    {
      primaryText: localTranslate('light_mode'),
      onClick: onClickLightMode,
      toggle: getConfig('THEME_MODE') === 'LIGHT',
      hidden: true,
    },
    {
      primaryText: localTranslate('change_riot_client_path'),
      secondaryText: getConfig('RIOT_CLIENT_PATH'),
      onClick: onClickChangeRiotPath,
    },
    {
      primaryText: localTranslate('toggle_show_client'),
      onClick: onClickToggleClient,
      toggle: isClientOpen,
    },
    {
      primaryText: localTranslate('reload_game_data'),
      onClick: onClickReloadGameData,
    },
    {
      primaryText: localTranslate('close_client'),
      onClick: onClickCloseClient,
    },
  ];

  return (
    <List>
      {btn
        .filter((b) => !b.hidden)
        .map((b) => (
          <ListItem key={b.primaryText} disablePadding>
            <ListItemButton onClick={b.onClick}>
              <ListItemText
                primary={b.primaryText}
                secondary={b.secondaryText}
              />
              {b.toggle !== undefined && <CustomCheckBox checked={b.toggle} />}
            </ListItemButton>
          </ListItem>
        ))}
      <ListItem>
        <VolumeBar />
      </ListItem>
    </List>
  );
};
