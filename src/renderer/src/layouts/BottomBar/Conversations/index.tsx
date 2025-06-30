import { useState } from 'react';
import { LolChatV1Conversations } from '@shared/typings/lol/response/lolChatV1Conversations';
import { Stack } from '@mui/material';
import { ConversationButton } from '@render/layouts/BottomBar/Conversations/ConversationButton';
import { withClientConnected } from '@render/hoc/withClientConnected';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';

export const Conversations = withClientConnected(() => {
  const [conversations, setConversations] = useState<LolChatV1Conversations[]>(
    [],
  );

  const { loadEventData } = useLeagueClientEvent(
    '/lol-chat/v1/conversations',
    (data) => {
      setConversations(data.filter((d) => d.type === 'chat'));
    },
  );

  useLeagueClientEvent(
    '/lol-chat/v1/conversations/{id}/messages/{id}',
    (data) => {
      if (data.type !== 'system') return;
      if (data.body === 'left_room') {
        setConversations((prev) => prev.filter((c) => c.id !== data.fromPid));
      }
      if (data.body === 'joined_room') {
        loadEventData();
      }
    },
  );

  return (
    <Stack direction={'row'} columnGap={0.5} width={'100%'}>
      {conversations.map((c) => {
        return <ConversationButton key={c.id} conversation={c} />;
      })}
    </Stack>
  );
});
