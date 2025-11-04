import { ChatGroup } from '@render/layouts/Lobby/ChatGroup';
import { Undefined } from '@shared/typings/generic.typing';
import { LolLobbyV2Lobby } from '@shared/typings/lol/response/lolLobbyV2Lobby';

interface EndGameChatGroupProps {
  mucJwtDto: Undefined<LolLobbyV2Lobby['mucJwtDto']>;
}

export const EndGameChatGroup = ({ mucJwtDto }: EndGameChatGroupProps) => {
  if (!mucJwtDto) return null;
  return (
    <div style={{ width: 400 }}>
      <ChatGroup mucJwtDto={mucJwtDto} type={'postGame'} chatHeight={160} />
    </div>
  );
};
