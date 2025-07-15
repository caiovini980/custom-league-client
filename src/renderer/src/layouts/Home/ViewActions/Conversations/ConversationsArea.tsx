import { Box, Stack, Typography } from '@mui/material';
import { CustomIconButton, CustomTextField } from '@render/components/input';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { LolChatV1Conversations } from '@shared/typings/lol/response/lolChatV1Conversations';
import { LolChatV1Conversations_Id_Messages as LolChatV1Conversations_Id_MessagesRes } from '@shared/typings/lol/response/lolChatV1Conversations_Id_Messages';
import { formatDateTime } from '@shared/utils/date.util';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { FaMinus } from 'react-icons/fa6';

interface ConversationsAreaProps {
  onClose: () => void;
  conversation: LolChatV1Conversations;
}

export const ConversationsArea = ({
  onClose,
  conversation,
}: ConversationsAreaProps) => {
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

  useLeagueClientEvent(
    buildEventUrl('/lol-chat/v1/conversations/{id}/messages', conversation.id),
    (data) => {
      setConversationMessages(data);
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
      <Stack
        direction={'row'}
        alignItems={'center'}
        height={50}
        columnGap={1}
        sx={{
          px: 1,
          borderBottom: '1px solid var(--mui-palette-divider)',
        }}
      >
        <Stack direction={'column'}>
          <Typography>{conversation.gameName}</Typography>
          <Typography fontSize={'0.7rem'} color={'textDisabled'}>
            #{conversation.gameTag}
          </Typography>
        </Stack>
        <Box flexGrow={1} />
        <CustomIconButton sx={{ p: 0.5 }} onClick={onClose}>
          <FaMinus size={18} />
        </CustomIconButton>
      </Stack>
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
                    p: 0.6,
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
