import { ChatGroup } from '@render/layouts/Lobby/ChatGroup';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { isEqual } from 'lodash-es';

export const LobbyChatGroup = () => {
  const mucJwtDto = lobbyStore.lobby.use((s) => s?.mucJwtDto, isEqual);
  const hasMembers = lobbyStore.lobby.use((s) => (s?.members.length ?? 0) > 1);

  if (!mucJwtDto) return null;

  return (
    <div style={{ width: 400 }}>
      <ChatGroup
        type={'customGame'}
        mucJwtDto={mucJwtDto}
        connectWhen={hasMembers}
      />
    </div>
  );
};
