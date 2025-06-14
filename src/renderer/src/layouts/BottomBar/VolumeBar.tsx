import { Slider, Stack } from '@mui/material';
import { CustomIconButton } from '@render/components/input';
import { useEffect, useRef } from 'react';
import { FaVolumeHigh, FaVolumeLow, FaVolumeXmark } from 'react-icons/fa6';
import { electronHandle } from '@render/utils/electronFunction.util';
import { delay } from 'lodash';
import { appConfigStore } from '@render/zustand/stores/appConfigStore';
import { useAudioManager } from '@render/hooks/useAudioManager';

export const VolumeBar = () => {
  const volume: number = appConfigStore.VOLUME.use();
  const cachedVolume = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { play } = useAudioManager();

  const changeVolume = (value: number) => {
    appConfigStore.VOLUME.set(value);
  };

  const onChangeVolume = (_event: unknown, value: number) => {
    changeVolume(value / 100);
  };

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
      return <FaVolumeHigh size={25} />;
    }

    if (volume > 0) {
      return <FaVolumeLow size={25} />;
    }

    return <FaVolumeXmark size={25} />;
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      electronHandle.appConfig.setConfig({
        name: 'VOLUME',
        value: volume,
      });
    }, 500);
  }, [volume]);

  return (
    <Stack direction="row" columnGap={1} width="100%" alignItems="center">
      <CustomIconButton onClick={onVolumeButtonClicked}>
        {changeIconBasedOnVolume()}
      </CustomIconButton>
      <Slider
        aria-label="Volume"
        value={volume * 100}
        onChange={onChangeVolume}
        sx={{ width: '70%' }}
      />
    </Stack>
  );
};
