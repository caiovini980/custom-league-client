import { Slider, Stack } from '@mui/material';
import { CustomIconButton } from '@render/components/input';
import { storeActions, storeValues, useStore } from '@render/zustand/store';
import { useEffect, useRef } from 'react';
import { FaVolumeHigh, FaVolumeLow, FaVolumeXmark } from 'react-icons/fa6';
import { electronHandle } from '@render/utils/electronFunction.util';
import { AudioPlayer, AudioPlayerRef } from '@render/components/AudioPlayer';
import { delay } from 'lodash';

export const VolumeBar = () => {
  const volume: number = useStore().appConfig.VOLUME();
  const cachedVolume = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<AudioPlayerRef>(null);

  const onChangeVolume = (_event: unknown, value: number) => {
    storeActions.appConfig.VOLUME(value / 100);
  };

  const onVolumeButtonClicked = () => {
    if (volume > 0) {
      // cache no volume atual
      cachedVolume.current = storeValues.appConfig.VOLUME();

      // setar posição do slider para 0
      // setar volume como 0
      audioRef.current?.play();
      delay(() => {
        storeActions.appConfig.VOLUME(0);
      }, 50);
    } else {
      audioRef.current?.play();
      storeActions.appConfig.VOLUME(cachedVolume.current);
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

      <AudioPlayer path="mute_unmute.ogg" autoPlay={false} ref={audioRef} />

      <Slider
        aria-label="Volume"
        value={volume * 100}
        onChange={onChangeVolume}
        sx={{ width: '70%' }}
      />
    </Stack>
  );
};
