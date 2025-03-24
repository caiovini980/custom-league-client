import { useMakeIpc } from '@render/utils/useMakeIpc.util'

export const useServerIpc = useMakeIpc('server', ({ ipc }) => {
  const getIslandsWorld = () => {
    return ipc.sendInfo('')
  }

  return {
    getIslandsWorld
  }
})
