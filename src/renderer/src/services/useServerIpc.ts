import { makeIpc } from '@render/utils/useMakeIpc.util';

export const useServerIpc = makeIpc('server', ({ ipc }) => {
  const getServerInfo = () => {
    return ipc.sendInfo('');
  };

  return {
    getServerInfo,
  };
});
