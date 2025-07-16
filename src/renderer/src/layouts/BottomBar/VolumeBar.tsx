import { debounce, Slider, Stack } from '@mui/material';
import { CustomIconButton } from '@render/components/input';
import { useAudioManager } from '@render/hooks/useAudioManager';
import { electronHandle } from '@render/utils/electronFunction.util';
import { appConfigStore } from '@render/zustand/stores/appConfigStore';
import { delay } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaVolumeHigh, FaVolumeLow, FaVolumeXmark } from 'react-icons/fa6';

export const VolumeBar = () => {
  const volume = appConfigStore.VOLUME.use();
  const cachedVolume = useRef<number>(0);
  const { play } = useAudioManager();

  const iconSize = 18;

  const [volumeSlider, setVolumeSlider] = useState(volume * 100);

  const changeVolume = (value: number) => {
    appConfigStore.VOLUME.set(value);
  };

  const onChangeVolume = useCallback(
    debounce((value: number) => {
      changeVolume(value / 100);
      electronHandle.appConfig.setConfig({
        name: 'VOLUME',
        value: value / 100,
      });
    }, 100),
    [],
  );

  const onVolumeButtonClicked = () => {
    if (volume > 0) {
      // cache no volume atual
      cachedVolume.current = appConfigStore.VOLUME.get();

      // setar posição do slider para 0
      // setar volume como 0
      play('mute_unmute');
      delay(() => {
        changeVolume(0);
      }, 50);
    } else {
      play('mute_unmute');
      changeVolume(cachedVolume.current);
    }
  };

  const changeIconBasedOnVolume = () => {
    if (volume > 0.5) {
      return <FaVolumeHigh size={iconSize} />;
    }

    if (volume > 0) {
      return <FaVolumeLow size={iconSize} />;
    }

    return <FaVolumeXmark size={iconSize} />;
  };

  useEffect(() => {
    onChangeVolume(volumeSlider);
  }, [volumeSlider]);

  return (
    <Stack direction="row" columnGap={1} width="100%" alignItems="center">
      <CustomIconButton onClick={onVolumeButtonClicked}>
        {changeIconBasedOnVolume()}
      </CustomIconButton>
      <Slider
        size={'small'}
        aria-label="Volume"
        value={volumeSlider}
        onChange={(_, value) => setVolumeSlider(value)}
        valueLabelDisplay={'auto'}
        sx={{ width: '70%' }}
      />
    </Stack>
  );
};
