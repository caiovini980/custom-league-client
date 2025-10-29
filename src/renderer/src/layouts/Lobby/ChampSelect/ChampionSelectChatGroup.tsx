import { ChatGroup } from '@render/layouts/Lobby/ChatGroup';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';

export const ChampionSelectChatGroup = () => {
  const mucJwtDto = champSelectStore.getSessionData(
    (s) => s.chatDetails.mucJwtDto,
  );

  if (!mucJwtDto) return null;

  return (
    <ChatGroup mucJwtDto={mucJwtDto} chatHeight={200} type={'championSelect'} />
  );
};
