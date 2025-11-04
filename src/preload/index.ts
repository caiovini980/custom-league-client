import { preloadAllSounds } from '../renderer/src/hooks/useAudioManager';
import { IpcRendererImpl } from './ipc/IpcRendererImpl';

IpcRendererImpl.init();
preloadAllSounds();

console.log('preload loaded');
