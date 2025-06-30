import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { appConfigStore } from '@render/zustand/stores/appConfigStore';

export interface AudioSettings {
  path: string;
  autoPlay?: boolean;
}

export interface AudioPlayerRef {
  play: (override?: boolean) => void;
  stop: () => void;
}

export const AudioPlayer = forwardRef<AudioPlayerRef, AudioSettings>(
  ({ path, autoPlay = false }, ref) => {
    const volume = appConfigStore.VOLUME.use();
    const audioRef = useRef<HTMLAudioElement>(null);

    useImperativeHandle(
      ref,
      () => {
        const audio = audioRef.current as HTMLAudioElement;
        const stop = () => {
          audio.pause();
          audio.currentTime = 0;
        };

        const play = (override = true) => {
          if (override) {
            stop();
          }
          audio.play();
        };

        return { play, stop };
      },
      [],
    );

    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    }, [volume]);

    return <audio src={`sounds/${path}`} autoPlay={autoPlay} ref={audioRef} />;
  },
);
