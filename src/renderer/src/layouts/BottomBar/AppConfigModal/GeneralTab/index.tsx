import { Stack, Switch } from '@mui/material';
import { useLocalTranslate } from '@render/hooks/useLocalTranslate';
import { useElectronHandle } from '@render/utils/electronFunction.util';
import { GetAppConfigResponse } from '@shared/typings/ipc-function/handle/app-config.typing';
import { appConfigStore } from '@render/zustand/stores/appConfigStore';
import { LabelAction } from '@render/layouts/BottomBar/AppConfigModal/LabelAction';
import { CustomIconButton } from '@render/components/input';
import { FaEdit } from 'react-icons/fa';
import { useSnackNotification } from '@render/hooks/useSnackNotification';

export const GeneralTab = () => {
  const { snackError } = useSnackNotification();
  const { localTranslate } = useLocalTranslate();
  const config = appConfigStore.use();
  const { appConfig } = useElectronHandle();

  const getConfig = (key: keyof GetAppConfigResponse) => {
    return config[key] ?? '-';
  };

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

  const onClickLightMode = () => {
    const mode = getConfig('THEME_MODE') === 'DARK' ? 'LIGHT' : 'DARK';
    appConfig.setConfig({
      name: 'THEME_MODE',
      value: mode,
    });
  };

  return (
    <Stack direction={'column'} rowGap={1} p={1}>
      <LabelAction
        label={localTranslate('change_riot_client_path')}
        helperText={getConfig('RIOT_CLIENT_PATH')}
        action={
          <CustomIconButton onClick={onClickChangeRiotPath}>
            <FaEdit size={14} />
          </CustomIconButton>
        }
      />
      <LabelAction
        label={localTranslate('light_mode')}
        action={
          <Switch
            size={'small'}
            checked={getConfig('THEME_MODE') === 'LIGHT'}
            onChange={() => onClickLightMode()}
          />
        }
        experimental
      />
    </Stack>
  );
};
