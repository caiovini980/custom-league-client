import {
  Box,
  ButtonBase,
  Collapse,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { CustomIconButton, CustomTextField } from '@render/components/input';
import { LolChatV1Conversations } from '@shared/typings/lol/response/lolChatV1Conversations';
import { FaMinus, FaX } from 'react-icons/fa6';
import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { GoDotFill } from 'react-icons/go';
import { getChatAvailabilityColor } from '@render/utils/chat.util';
import { chatStore } from '@render/zustand/stores/chatStore';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { LolChatV1Conversations_Id_Messages as LolChatV1Conversations_Id_MessagesRes } from '@shared/typings/lol/response/lolChatV1Conversations_Id_Messages';
import { formatDateTime } from '@shared/utils/date.util';
import { alpha } from '@mui/material/styles';

interface ConversationButtonProps {
  conversation: LolChatV1Conversations;
}

export const ConversationButton = ({
  conversation,
}: ConversationButtonProps) => {
  const { rcpFeLolSocial } = useLeagueTranslate();
  const { makeRequest } = useLeagueClientRequest();

  const friends = chatStore.friends.use();

  const rcpFeLolSocialTrans = rcpFeLolSocial('trans');
  const conversationWidth = 280;

  const messagesContainerDivRef = useRef<HTMLDivElement>(null);

  const [isHighlight, setIsHighlight] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('');
  const [conversationMessages, setConversationMessages] = useState<
    LolChatV1Conversations_Id_MessagesRes[]
  >([]);

  const handleToggle = () => {
    setIsActive((prev) => !prev);
  };

  const handleClose = () => {
    setIsActive(false);
  };

  const onClickRemoveChat = () => {
    const [id] = conversation.id.split('@');
    makeRequest(
      'DELETE',
      buildEventUrl(
        '/lol-chat/v1/conversations/{id}%40{string}.pvp.net',
        id,
        conversation.targetRegion,
      ),
      undefined,
    );
  };

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

  const getColor = () => {
    const friend = friends.find((f) => f.id === conversation.id);
    if (friend) {
      return getChatAvailabilityColor(friend.availability);
    }
    return getChatAvailabilityColor('offline');
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      const div = messagesContainerDivRef.current;
      if (div) {
        div.scrollTo({
          top: div.scrollHeight,
        });
      }
    }, 500);
  };

  useLeagueClientEvent(
    '/lol-chat/v1/conversations/active',
    (data) => {
      if (conversation.id === data.id) {
        setIsActive(true);
      }
    },
    {
      deps: [conversation.id],
    },
  );

  const { loadEventData } = useLeagueClientEvent(
    buildEventUrl('/lol-chat/v1/conversations/{id}/messages', conversation.id),
    (data) => {
      setConversationMessages(data);
      scrollToBottom();
    },
    {
      deps: [conversation.id],
    },
  );

  useLeagueClientEvent(
    buildEventUrl(
      '/lol-chat/v1/conversations/{id}%40{string}.pvp.net',
      conversation.id.split('@')[0],
      conversation.targetRegion,
    ),
    (data) => {
      if (!isActive) {
        setIsHighlight(
          !conversationMessages.some((c) => c.id === data.lastMessage.id),
        );
      }
      loadEventData();
    },
    {
      deps: [conversationMessages.length, isActive],
    },
  );

  useEffect(() => {
    if (isActive) {
      setIsHighlight(false);
      scrollToBottom();
    }
  }, [isActive]);

  return (
    <Stack
      position={'relative'}
      component={Paper}
      direction={'row'}
      alignItems={'center'}
      columnGap={1}
      sx={{
        p: 1,
        background: (t) =>
          isHighlight ? alpha(t.palette.highlight, 0.6) : undefined,
        '& svg.dot': {
          color: getColor(),
        },
      }}
      variant={'outlined'}
      width={conversationWidth}
    >
      <GoDotFill className={'dot'} />
      <ButtonBase onClick={handleToggle} sx={{ width: '100%' }}>
        <Typography>{conversation.gameName}</Typography>
      </ButtonBase>
      <CustomIconButton sx={{ p: 0.5 }} onClick={onClickRemoveChat}>
        <FaX size={12} />
      </CustomIconButton>
      <Collapse
        in={isActive}
        timeout={200}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          mb: '40px',
          zIndex: (t) => t.zIndex.fab,
        }}
      >
        <Stack
          direction={'column'}
          width={conversationWidth}
          height={300}
          component={Paper}
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
            <GoDotFill className={'dot'} />
            <Stack direction={'column'}>
              <Typography>{conversation.gameName}</Typography>
              <Typography fontSize={'0.7rem'} color={'textDisabled'}>
                #{conversation.gameTag}
              </Typography>
            </Stack>
            <Box flexGrow={1} />
            <CustomIconButton sx={{ p: 0.5 }} onClick={handleClose}>
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
                        background: `var(--mui-palette-${conversation.id === m.fromId ? 'background-paper' : 'primary-main'})`,
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
            placeholder={rcpFeLolSocialTrans('context_menu_send_message')}
            value={message}
            onChangeText={setMessage}
            onKeyDown={handleSendMessage}
            slotProps={{
              input: {
                sx: {
                  p: 0.5,
                  borderRadius: 0,
                },
              },
            }}
          />
        </Stack>
      </Collapse>
    </Stack>
  );
};
