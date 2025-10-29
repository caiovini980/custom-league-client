import { Stack, Typography } from '@mui/material';
import { CustomTextField } from '@render/components/input';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { ConversationHeader } from '@render/layouts/Home/SideBar/ViewActions/Conversations/ConversationHeader';
import { LolChatV1Conversations } from '@shared/typings/lol/response/lolChatV1Conversations';
import { LolChatV1Conversations_Id_Messages as LolChatV1Conversations_Id_MessagesRes } from '@shared/typings/lol/response/lolChatV1Conversations_Id_Messages';
import { formatDateTime } from '@shared/utils/date.util';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';

interface ConversationsAreaProps {
  conversation: LolChatV1Conversations;
}

export const ConversationsArea = ({ conversation }: ConversationsAreaProps) => {
  const { rcpFeLolSocial } = useLeagueTranslate();
  const { makeRequest } = useLeagueClientRequest();

  const { rcpFeLolSocialTrans } = rcpFeLolSocial;

  const messagesContainerDivRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState('');
  const [conversationMessages, setConversationMessages] = useState<
    LolChatV1Conversations_Id_MessagesRes[]
  >([]);

  const handleSendMessage = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      makeRequest(
        'POST',
        buildEventUrl(
          '/lol-chat/v1/conversations/{id}/messages',
          conversation.id,
        ),
        {
          body: message,
        },
      ).then((res) => {
        if (res.ok) {
          setMessage('');
          loadEventData();
        }
      });
      return;
    }
  };

  const scrollToBottom = (delay = 500) => {
    setTimeout(() => {
      const div = messagesContainerDivRef.current;
      if (div) {
        div.scrollTo({
          top: div.scrollHeight,
        });
      }
    }, delay);
  };

  const { loadEventData } = useLeagueClientEvent(
    buildEventUrl('/lol-chat/v1/conversations/{id}/messages', conversation.id),
    (data) => {
      setConversationMessages(data);
    },
    {
      deps: [conversation.id],
    },
  );

  useLeagueClientEvent(
    buildEventUrl(
      '/lol-chat/v1/conversations/{id}/messages/{id}',
      conversation.id,
    ),
    () => {
      loadEventData();
    },
    {
      deps: [conversation.id],
    },
  );

  useEffect(() => {
    setConversationMessages([]);
  }, [conversation.id]);

  useEffect(() => {
    scrollToBottom(0);
  }, [conversationMessages.length]);

  return (
    <Stack
      direction={'column'}
      width={'100%'}
      height={'100%'}
      overflow={'auto'}
    >
      <ConversationHeader
        gameName={conversation.gameName}
        gameTag={conversation.gameTag}
      />
      <Stack
        ref={messagesContainerDivRef}
        direction={'column'}
        p={1}
        height={'100%'}
        width={'100%'}
        overflow={'auto'}
        rowGap={1}
      >
        {conversationMessages
          .filter((m) => m.type === 'chat')
          .map((m) => {
            return (
              <Stack
                key={m.id}
                direction={'column'}
                width={'100%'}
                alignItems={
                  conversation.id === m.fromId ? 'flex-start' : 'flex-end'
                }
              >
                <Typography
                  sx={{
                    maxWidth: '75%',
                    borderRadius: 2,
                    px: 0.6,
                    py: 0.2,
                    overflowWrap: 'break-word',
                    background: `var(--mui-palette-${conversation.id === m.fromId ? 'secondary-main' : 'primary-main'})`,
                  }}
                >
                  {m.body}
                </Typography>
                <Typography fontSize={'0.6rem'} color={'textDisabled'}>
                  {formatDateTime(m.timestamp)}
                </Typography>
              </Stack>
            );
          })}
      </Stack>
      <CustomTextField
        maxRows={3}
        multiline
        placeholder={rcpFeLolSocialTrans(
          'conversation_get_started_placeholder',
        )}
        value={message}
        onChangeText={setMessage}
        onKeyDown={handleSendMessage}
        slotProps={{
          input: {
            sx: {
              p: 1,
              borderRadius: 0,
            },
          },
        }}
      />
    </Stack>
  );
};
