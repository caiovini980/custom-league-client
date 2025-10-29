import { Stack } from '@mui/material';
import { CustomIconButton } from '@render/components/input';
import { useLocalTranslate } from '@render/hooks/useLocalTranslate';
import { useSnackNotification } from '@render/hooks/useSnackNotification';
import { LabelAction } from '@render/layouts/BottomBar/AppConfigModal/LabelAction';
import { useElectronHandle } from '@render/utils/electronFunction.util';
import { appConfigStore } from '@render/zustand/stores/appConfigStore';
import { GetAppConfigResponse } from '@shared/typings/ipc-function/handle/app-config.typing';
import { FaEdit } from 'react-icons/fa';

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
    </Stack>
  );
};
