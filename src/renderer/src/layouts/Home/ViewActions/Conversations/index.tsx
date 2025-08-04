import { Divider, List, Paper, Stack } from '@mui/material';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { ConversationButton } from '@render/layouts/Home/ViewActions/Conversations/ConversationButton';
import { ConversationsArea } from '@render/layouts/Home/ViewActions/Conversations/ConversationsArea';
import { useViewActionButtonContext } from '@render/layouts/Home/ViewActions/ViewActionButton';
import { LolChatV1Conversations } from '@shared/typings/lol/response/lolChatV1Conversations';
import { orderBy } from 'lodash-es';
import { useEffect, useState } from 'react';

export const Conversations = () => {
  const { makeRequest } = useLeagueClientRequest();
  const actionButtonContext = useViewActionButtonContext();

  const [conversations, setConversations] = useState<LolChatV1Conversations[]>(
    [],
  );
  const [conversationActive, setConversationActive] =
    useState<LolChatV1Conversations>();

  const onClose = () => {
    actionButtonContext.forceClose();
  };

  const { loadEventData } = useLeagueClientEvent(
    '/lol-chat/v1/conversations',
    (data) => {
      const filtered = orderBy(
        data.filter((d) => d.type === 'chat'),
        (d) => d.unreadMessageCount,
        'desc',
      );
      const unreadAmount = filtered.reduce(
        (sum, curr) => sum + curr.unreadMessageCount,
        0,
      );
      setConversations(filtered);
      actionButtonContext.setBadge(unreadAmount);
    },
  );

  useLeagueClientEvent('/lol-chat/v1/conversations/{id}/messages/{id}', () => {
    loadEventData();
  });

  useLeagueClientEvent(
    '/lol-chat/v1/conversations/active',
    (data) => {
      loadEventData();
      if (data) {
        actionButtonContext.forceOpen();
        const conversation = conversations.find((c) => c.id === data.id);
        if (conversation) {
          setConversationActive(conversation);
        }
      } else {
        actionButtonContext.forceClose();
      }
    },
    {
      showDeleted: true,
      deps: [conversations.map((c) => c.id).join(':')],
    },
  );

  useEffect(() => {
    if (!actionButtonContext.isActive) {
      makeRequest('DELETE', '/lol-chat/v1/conversations/active', undefined);
    }
  }, [actionButtonContext.isActive]);

  return (
    <Stack
      direction={'row'}
      width={600}
      height={300}
      component={Paper}
      variant={'outlined'}
      overflow={'auto'}
    >
      <List
        disablePadding
        sx={{ height: '100%', flexShrink: 0, overflow: 'auto' }}
      >
        {conversations.map((c) => {
          return (
            <ConversationButton
              key={c.id}
              active={c.id === conversationActive?.id}
              conversation={c}
              onClick={() => setConversationActive(c)}
            />
          );
        })}
      </List>
      <Divider orientation={'vertical'} flexItem />
      {conversationActive && (
        <ConversationsArea
          conversation={conversationActive}
          onClose={onClose}
        />
      )}
    </Stack>
  );
};
