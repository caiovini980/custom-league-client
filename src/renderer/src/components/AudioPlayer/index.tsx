import { useStore } from '@render/zustand/store';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface AudioSettings {
  path: string;
  autoPlay: boolean;
}

export interface AudioPlayerRef {
  play: () => void;
  stop: () => void;
}

export const AudioPlayer = forwardRef<AudioPlayerRef, AudioSettings>(
  ({ path, autoPlay }, ref) => {
    const volume: number = useStore().sound.volume();
    const audioRef = useRef<HTMLAudioElement>(null);

    useImperativeHandle(
      ref,
      () => {
        const audio = audioRef.current as HTMLAudioElement;
        const stop = () => {
          audio.pause();
          audio.currentTime = 0;
        };

        const play = () => {
          stop();
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

    return <audio src={path} autoPlay={autoPlay} ref={audioRef} />;
  },
);
