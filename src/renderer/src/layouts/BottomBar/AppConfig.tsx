import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useElectronHandle } from '@render/utils/electronFunction.util';
import { useEffect, useState } from 'react';

export const AppConfig = () => {
  const { appConfig } = useElectronHandle();

  const [config, setConfig] = useState<{ name: string; value: unknown }[]>([]);

  const loadConfig = () => {
    appConfig.getConfig().then((config) => {
      setConfig(config);
    });
  };

  const onClickChangeRiotPath = () => {
    appConfig.setRiotPath().then(() => {
      loadConfig();
    });
  };

  const getConfig = (key: string) => {
    return (config.find((c) => c.name === key)?.value as string) ?? '-';
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton onClick={onClickChangeRiotPath}>
          <ListItemText
            primary={'Change Riot Client Path'}
            secondary={getConfig('RIOT_PATH')}
          />
        </ListItemButton>
      </ListItem>
    </List>
  );
};
