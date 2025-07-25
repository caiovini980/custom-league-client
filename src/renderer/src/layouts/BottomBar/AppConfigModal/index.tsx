import CustomDialog, {
  CustomDialogCloseFloatingButton,
} from '@render/components/CustomDialog';
import CustomTab, { CustomTabPanel } from '@render/components/CustomTab';
import { CustomIconButton } from '@render/components/input';
import { withClientConnected } from '@render/hoc/withClientConnected';
import { useAudioManager } from '@render/hooks/useAudioManager';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { GeneralTab } from '@render/layouts/BottomBar/AppConfigModal/GeneralTab';
import { SoundTab } from '@render/layouts/BottomBar/AppConfigModal/SoundTab';
import { useState } from 'react';
import { FaCog } from 'react-icons/fa';

export const AppConfigModal = withClientConnected(() => {
  const { play } = useAudioManager();
  const { rcpFeLolSharedComponents, rcpFeLolSettings } = useLeagueTranslate();

  const [open, setOpen] = useState(false);

  const { rcpFeLolSharedComponentsTrans } = rcpFeLolSharedComponents;
  const { rcpFeLolSettingsTrans } = rcpFeLolSettings;

  const handleChangeOpenSetting = (value: boolean) => {
    play('open_settings');
    setOpen(value);
  };

  return (
    <>
      <CustomDialog
        title={rcpFeLolSharedComponentsTrans(
          'LOL_INGAME_SETTINGS_RESET_ALERT_SET_BUTTON',
        )}
        open={open}
        maxWidth={'md'}
        fullWidth
        actionsComponent={<div />}
      >
        <CustomDialogCloseFloatingButton
          handleClose={() => handleChangeOpenSetting(false)}
        />
        <CustomTab mode={'overlay'}>
          <CustomTabPanel
            label={rcpFeLolSettingsTrans('lol_settings_nav_title_general')}
            name={'general'}
          >
            <GeneralTab />
          </CustomTabPanel>
          <CustomTabPanel
            label={rcpFeLolSettingsTrans('lol_settings_nav_title_sound')}
            name={'sound'}
          >
            <SoundTab />
          </CustomTabPanel>
        </CustomTab>
      </CustomDialog>
      <CustomIconButton onClick={() => handleChangeOpenSetting(true)}>
        <FaCog />
      </CustomIconButton>
    </>
  );
});
