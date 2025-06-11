import { Slider, Stack } from '@mui/material';
import { CustomIconButton } from '@render/components/input';
import { storeActions, storeValues, useStore } from '@render/zustand/store';
import { useRef } from 'react';
import { FaVolumeHigh, FaVolumeLow, FaVolumeXmark } from 'react-icons/fa6';

export const VolumeBar = () => {
  const volume: number = useStore().sound.volume();
  const cachedVolume = useRef<number>(0);

  const onChangeVolume = (_event: unknown, value: number) => {
    storeActions.sound.volume(value / 100);
  };

  const onVolumeButtonClicked = () => {
    if (storeValues.sound.volume() > 0) {
      // cache no volume atual
      cachedVolume.current = storeValues.sound.volume();

      // setar posição do slider para 0
      // setar volume como 0
      storeActions.sound.volume(0);
    } else {
      storeActions.sound.volume(cachedVolume.current);
    }
  };

  const changeIconBasedOnVolume = () => {
    if (storeValues.sound.volume() > 0.5) {
      return <FaVolumeHigh size={25} />;
    }

    if (storeValues.sound.volume() > 0) {
      return <FaVolumeLow size={25} />;
    }

    return <FaVolumeXmark size={25} />;
  };

  return (
    <Stack direction="column" alignItems="flex-start" width="100%">
      <Stack direction="row" columnGap={2} width="100%" alignItems="center">
        <CustomIconButton onClick={onVolumeButtonClicked}>
          {changeIconBasedOnVolume()}
        </CustomIconButton>

        <Slider
          aria-label="Volume"
          value={volume * 100}
          onChange={onChangeVolume}
        />
      </Stack>
    </Stack>
  );
};
