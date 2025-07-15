import { CustomIconButtonTooltip } from '@render/components/input';
import { useLocalTranslate } from '@render/hooks/useLocalTranslate';
import { electronHandle } from '@render/utils/electronFunction.util';
import { appConfigStore } from '@render/zustand/stores/appConfigStore';
import { FaMoon, FaSun } from 'react-icons/fa6';

export const ThemeModeShortcut = () => {
  const { localTranslate } = useLocalTranslate();
  const themeMode = appConfigStore.THEME_MODE.use();

  const onClickLightMode = () => {
    const mode = themeMode === 'DARK' ? 'LIGHT' : 'DARK';
    electronHandle.appConfig.setConfig({
      name: 'THEME_MODE',
      value: mode,
    });
  };

  return (
    <CustomIconButtonTooltip
      title={localTranslate('light_mode')}
      onClick={onClickLightMode}
    >
      {themeMode === 'DARK' ? <FaMoon /> : <FaSun />}
    </CustomIconButtonTooltip>
  );
};
