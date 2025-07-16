import { CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { CustomTextField } from '@render/components/input';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { LolChatV1Conversations_Id_Messages as LolChatV1Conversations_Id_MessagesRes } from '@shared/typings/lol/response/lolChatV1Conversations_Id_Messages';
import { LolChatV1Friends } from '@shared/typings/lol/response/lolChatV1Friends';
import { LolLobbyV2Lobby } from '@shared/typings/lol/response/lolLobbyV2Lobby';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';

interface ChatGroupProps {
  connectWhen?: boolean;
  mucJwtDto: LolLobbyV2Lobby['mucJwtDto'];
  chatHeight?: number;
}

export const ChatGroup = ({
  connectWhen,
  mucJwtDto,
  chatHeight = 200,
}: ChatGroupProps) => {
  const { rcpFeLolSocial } = useLeagueTranslate();
  const { makeRequest } = useLeagueClientRequest();

  const { rcpFeLolSocialTrans } = rcpFeLolSocial;

  const messagesContainerDivRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState('');
  const [conversationMessages, setConversationMessages] = useState<
    LolChatV1Conversations_Id_MessagesRes[]
  >([]);
  const [participants, setParticipants] = useState<LolChatV1Friends[]>([]);
  const [loading, setLoading] = useState(false);

  const conversationId = (() => {
    const { channelClaim, domain, targetRegion } = mucJwtDto;
    return `${channelClaim}@${domain}.${targetRegion}.pvp.net`;
  })();

  const handleSendMessage = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      makeRequest(
        'POST',
        buildEventUrl(
          '/lol-chat/v1/conversations/{id}/messages',
          conversationId,
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

  const getPlayerName = (pid: string) => {
    const participant = participants.find((p) => p.id === pid);
    if (participant) return `${participant.gameName} #${participant.gameTag}:`;
    return '';
  };

  const getSystemMessage = (body: string, pid: string) => {
    if (body === 'joined_room') {
      return rcpFeLolSocialTrans(
        'system_message_joined_room',
        getPlayerName(pid),
      );
    }
    if (body === 'left_room') {
      return rcpFeLolSocialTrans(
        'system_message_left_room',
        getPlayerName(pid),
      );
    }
    return '';
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

  const { loadEventData: loadMessages } = useLeagueClientEvent(
    buildEventUrl('/lol-chat/v1/conversations/{id}/messages', conversationId),
    (data) => {
      setConversationMessages(data);
    },
    {
      makeInitialRequest: false,
      deps: [conversationId],
    },
  );

  const { loadEventData: loadParticipants } = useLeagueClientEvent(
    buildEventUrl(
      '/lol-chat/v1/conversations/{id}/participants',
      conversationId,
    ),
    (data) => {
      setParticipants(data);
    },
    {
      makeInitialRequest: false,
      deps: [conversationId],
    },
  );

  useLeagueClientEvent(
    buildEventUrl(
      '/lol-chat/v1/conversations/{id}/participants/{id}',
      conversationId,
    ),
    () => {
      loadParticipants();
    },
    {
      makeInitialRequest: false,
      deps: [conversationId],
    },
  );

  useLeagueClientEvent(
    buildEventUrl(
      '/lol-chat/v1/conversations/{id}/messages/{id}',
      conversationId,
    ),
    () => {
      loadMessages();
    },
    {
      makeInitialRequest: false,
      deps: [conversationId],
    },
  );

  const connectToChat = () => {
    setLoading(true);
    makeRequest('POST', '/lol-chat/v1/conversations', {
      type: 'customGame',
      mucJwtDto,
    }).then((res) => {
      if (res.ok) {
        setLoading(false);
        loadParticipants();
        loadMessages();
      } else {
        setTimeout(() => {
          connectToChat();
        }, 1000);
      }
    });
  };

  useEffect(() => {
    scrollToBottom(0);
  }, [conversationMessages.length]);

  useEffect(() => {
    if (connectWhen === false) return;
    connectToChat();
    return () => {
      if (!participants.length) return;
      makeRequest(
        'DELETE',
        buildEventUrl('/lol-chat/v1/conversations/{id}', conversationId),
        undefined,
      );
    };
  }, [conversationId, connectWhen]);

  return (
    <Stack
      direction={'column'}
      component={Paper}
      height={chatHeight}
      width={400}
      overflow={'auto'}
      variant={'outlined'}
    >
      <Stack
        ref={messagesContainerDivRef}
        direction={'column'}
        p={1}
        height={'100%'}
        width={'100%'}
        overflow={'auto'}
      >
        {conversationMessages.map((m) => {
          return (
            <Stack
              key={m.id}
              direction={'row'}
              width={'100%'}
              alignItems={'flex-start'}
              columnGap={1}
              justifyContent={'flex-start'}
            >
              {m.type === 'system' && (
                <Typography fontSize={'0.7rem'} color={'textDisabled'}>
                  {getSystemMessage(m.body, m.fromPid)}
                </Typography>
              )}
              {m.type === 'groupchat' && (
                <Typography
                  sx={{
                    color: `var(--mui-palette-${conversationId === m.fromId ? 'secondary-main' : 'primary-main'})`,
                    fontSize: '0.8rem',
                    '& > span': {
                      color: 'var(--mui-palette-text-primary)',
                      overflowWrap: 'break-word',
                    },
                  }}
                >
                  {getPlayerName(m.fromPid)} <span>{m.body}</span>
                </Typography>
              )}
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
        disabled={loading || !participants.length}
        startIcon={loading ? <CircularProgress size={16} /> : null}
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
