import { appConfigStore } from '@render/zustand/stores/appConfigStore';
import { useEffect, useRef } from 'react';
import { random } from 'lodash';

const soundName = [
  'game_found',
  'tab_change',
  'open_settings',
  'background_music',
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
] as const;

type SoundNameKeys = (typeof soundName)[number];

const audioFactory = (name: string) => {
  const audio = new Audio(`sounds/${name}.ogg`);
  audio.onerror = (...e) => {
    console.error(e);
    throw Error(`error on play sound: ${name}`);
  };
  return audio;
};

const sounds = soundName.reduce((prev, sn) => {
  return Object.assign(prev, {
    [sn]: audioFactory(sn),
  });
}, {}) as Record<SoundNameKeys, HTMLAudioElement>;

const soundMap = new Map<string, HTMLAudioElement>();

Object.keys(sounds).forEach((soundName) => {
  soundMap.set(soundName, sounds[soundName]);
});

export const useAudioManager = () => {
  const volume = appConfigStore.VOLUME.use();

  const play = (soundName: SoundNameKeys, stoppedBefore = true) => {
    const sound = sounds[soundName];
    sound.volume = volume;
    if (stoppedBefore) {
      stop(soundName);
    }
    sound.play();
  };

  const playOnce = (soundName: SoundNameKeys) => {
    const id = String(random(0, 10000));
    const sound = audioFactory(soundName);
    sound.volume = volume;
    sound.play();
    soundMap.set(id, sound);
    sound.onpause = () => {
      soundMap.delete(id);
    };
  };

  const stop = (soundName: SoundNameKeys) => {
    const sound = sounds[soundName];
    sound.currentTime = 0;
  };

  useEffect(() => {
    soundMap
      .values()
      .filter((sound) => !sound.paused)
      .forEach((sound) => {
        sound.volume = volume;
      });
  }, [volume]);

  return {
    play,
    stop,
    playOnce,
  };
};

export const useAudio = (name: SoundNameKeys, autoPlay = false) => {
  const audio = useRef(audioFactory(name));
  const volume = appConfigStore.VOLUME.use();

  useEffect(() => {
    if (autoPlay) audio.current.play();
  }, [autoPlay]);

  useEffect(() => {
    audio.current.volume = volume;
  }, [volume]);

  const stop = () => {
    audio.current.pause();
    audio.current.currentTime = 0;
  };

  const play = (replayOnPlayAgain = true) => {
    if (replayOnPlayAgain) {
      stop();
    }
    audio.current.play();
  };

  return { play, stop };
};
