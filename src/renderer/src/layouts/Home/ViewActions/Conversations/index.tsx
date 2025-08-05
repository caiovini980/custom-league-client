import { Divider, List, Paper, Stack, Typography } from '@mui/material';
import { useAudio } from '@render/hooks/useAudioManager';
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

  const sfxChatClose = useAudio('sfx-soc-ui-chatwindow-close');
  const sfxChatOpen = useAudio('sfx-soc-ui-chatwindow-open');

  const [conversations, setConversations] = useState<LolChatV1Conversations[]>(
    [],
  );
  const [conversationActive, setConversationActive] =
    useState<LolChatV1Conversations>();

  const onClose = () => {
    actionButtonContext.forceClose();
  };

  const removeConversationActive = () => {
    makeRequest('DELETE', '/lol-chat/v1/conversations/active', undefined);
    setConversationActive(undefined);
  };

  const { loadEventData } = useLeagueClientEvent(
    '/lol-chat/v1/conversations',
    (data) => {
      const filtered = orderBy(
        data.filter((d) => d.type === 'chat').filter((d) => d.gameName),
        (d) => d.unreadMessageCount,
        'desc',
      );
      setConversations(filtered);

      if (!filtered.length) {
        removeConversationActive();
      }
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
        const conversation = conversations.find((c) => c.id === data.id);
        if (conversation) {
          setConversationActive(conversation);
        }
      }
    },
    {
      showDeleted: true,
      deps: [conversations.map((c) => c.id).join(':')],
    },
  );

  useEffect(() => {
    if (actionButtonContext.isActive) {
      sfxChatOpen.replay();
    } else {
      sfxChatClose.replay();
      removeConversationActive();
    }
  }, [actionButtonContext.isActive]);

  useEffect(() => {
    if (
      !conversationActive &&
      conversations.length &&
      actionButtonContext.isActive
    ) {
      setConversationActive(conversations[0]);
    }
  }, [conversationActive, conversations.length, actionButtonContext.isActive]);

  return (
    <Stack
      direction={'row'}
      width={600}
      height={300}
      component={Paper}
      variant={'outlined'}
      overflow={'auto'}
    >
      {!conversations.length && (
        <Typography textAlign={'center'}>...</Typography>
      )}
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
      {conversationActive && (
        <>
          <Divider orientation={'vertical'} flexItem />
          <ConversationsArea
            conversation={conversationActive}
            onClose={onClose}
          />
        </>
      )}
    </Stack>
  );
};
