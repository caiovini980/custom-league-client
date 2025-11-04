import { appConfigStore } from '@render/zustand/stores/appConfigStore';
import { useCallback, useEffect, useRef } from 'react';

const soundName = [
  'game_found',
  'tab_change',
  'open_settings',
  'mute_unmute',
  'music-cs-allrandom-howlingabyss',
  'music-cs-blindpick-default',
  'music-champ-select',
  'sfx-cs-draft-10ban-intro',
  'sfx-cs-draft-ban-button-click',
  'sfx-cs-draft-notif-yourban',
  'sfx-cs-draft-notif-yourpick',
  'sfx-cs-draft-pick-intro',
  'sfx-cs-draft-right-pick-single',
  'music-cs-draft-finalization-01',
  'sfx-cs-lockin-button-click',
  'sfx-cs-notif-traderequest-accepted',
  'sfx-cs-notif-traderequest-declined',
  'sfx-cs-notif-traderequest-rcvd',
  'sfx-cs-timer-tick',
  'sfx-cs-timer-tick-small',
  'sfx-vignette-celebration-intro',
  'sfx-honor-votingceremony-intro',
  'sfx-soc-notif-chat-rcvd',
  'sfx-soc-ui-chatwindow-close',
  'sfx-soc-ui-chatwindow-open',
  'sfx-soc-notif-gameinvite-rcvd',
  'sfx-soc-notif-success',
  'sfx-soc-ui-gameinvite-accept-click',
  'sfx-cs-notif-swaprequest-rcvd',
] as const;

type SoundNameKeys = (typeof soundName)[number];

const audioCache: Record<string, HTMLAudioElement> = {};

export const preloadAllSounds = (volume = 1) => {
  soundName.forEach((name) => {
    if (!audioCache[name]) {
      audioCache[name] = audioFactory(name, volume);
    }
  });
};

const audioFactory = (name: string, volume = 1) => {
  const audio = new Audio(`sounds/${name}.ogg`);
  audio.volume = volume;
  audio.preload = 'auto';
  audio.onerror = (e: Event | string) => {
    console.error(`Error audio: ${name} -- ${e}`);
  };
  return audio;
};

export const useAudio = (name: SoundNameKeys, autoPlay = false) => {
  const audio = useRef<HTMLAudioElement | null>(null);
  const volume = appConfigStore.VOLUME.use();

  useEffect(() => {
    if (!audioCache[name]) {
      audioCache[name] = audioFactory(name, volume);
    }
    audio.current = audioCache[name];
    if (autoPlay) safePlay();
    return () => {
      stop();
    };
  }, [name]);

  useEffect(() => {
    if (audio.current) {
      audio.current.volume = volume;
    }
  }, [volume]);

  const stop = useCallback(() => {
    if (audio.current) {
      audio.current.pause();
      audio.current.currentTime = 0;
    }
  }, []);

  const play = () => {
    safePlay();
  };

  const replay = () => {
    if (audio.current) {
      audio.current.currentTime = 0;
      safePlay();
    }
  };

  const safePlay = async () => {
    try {
      await audio.current?.play();
    } catch (err) {
      console.warn(`Error on play ${name}:`, err);
    }
  };

  return { play, replay, stop };
};
