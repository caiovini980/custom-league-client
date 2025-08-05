import { Box, ButtonBase, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { CustomIconButton } from '@render/components/input';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { getChatAvailabilityColor } from '@render/utils/chat.util';
import { chatStore } from '@render/zustand/stores/chatStore';
import { LolChatV1Conversations } from '@shared/typings/lol/response/lolChatV1Conversations';
import { LolChatV1Conversations_Id_Messages as LolChatV1Conversations_Id_MessagesRes } from '@shared/typings/lol/response/lolChatV1Conversations_Id_Messages';
import { useEffect, useRef, useState } from 'react';
import { FaX } from 'react-icons/fa6';
import { GoDotFill } from 'react-icons/go';

interface ConversationButtonProps {
  active: boolean;
  onClick: () => void;
  conversation: LolChatV1Conversations;
}

export const ConversationButton = ({
  active,
  onClick,
  conversation,
}: ConversationButtonProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolSocial } = useLeagueTranslate();

  const friends = chatStore.friends.use();

  const { rcpFeLolSocialTrans } = rcpFeLolSocial;
  const conversationWidth = 240;

  const [isHighlight, setIsHighlight] = useState(false);
  const lastConversationMessage =
    useRef<LolChatV1Conversations_Id_MessagesRes>();

  const onClickRemoveChat = () => {
    makeRequest(
      'DELETE',
      buildEventUrl('/lol-chat/v1/conversations/{id}', conversation.id),
      undefined,
    );
  };

  const onClickItem = () => {
    onClick();
  };

  const getColor = () => {
    const friend = friends.find((f) => f.id === conversation.id);
    if (friend) {
      return getChatAvailabilityColor(friend.availability);
    }
    return getChatAvailabilityColor('offline');
  };

  const getLastMessage = () => {
    const { lastMessage } = conversation;
    if (!lastMessage) return '';
    const { body, type } = lastMessage;
    if (type === 'system') {
      if (body === 'joined_room') {
        return rcpFeLolSocialTrans('system_message_joined_room', '#');
      }
      if (body === 'left_room') {
        return rcpFeLolSocialTrans('system_message_left_room', '#');
      }
    }
    return body;
  };

  useLeagueClientEvent(
    buildEventUrl(
      '/lol-chat/v1/conversations/{uuid}%40{string}.pvp.net',
      conversation.id.split('@')[0],
      conversation.targetRegion,
    ),
    (data) => {
      if (!active) {
        setIsHighlight(
          lastConversationMessage.current?.id !== data.lastMessage?.id,
        );
        lastConversationMessage.current = data.lastMessage ?? undefined;
      }
    },
    {
      deps: [active],
    },
  );

  useEffect(() => {
    if (active) {
      setIsHighlight(false);
      makeRequest('PUT', '/lol-chat/v1/conversations/active', {
        id: conversation.id,
      }).then();
    }
  }, [active]);

  return (
    <Stack
      position={'relative'}
      direction={'row'}
      alignItems={'center'}
      columnGap={1}
      component={'li'}
      sx={{
        height: 50,
        background: (t) =>
          isHighlight ? alpha(t.palette.highlight.main, 0.6) : undefined,
        '& svg.dot': {
          color: getColor(),
        },
        borderBottom: '1px solid var(--mui-palette-divider)',
      }}
      width={conversationWidth}
    >
      <Stack
        direction={'row'}
        component={ButtonBase}
        onClick={onClickItem}
        width={'100%'}
        height={'100%'}
        p={0}
        justifyContent={'normal'}
        columnGap={1}
      >
        <Box
          display={active ? 'block' : 'none'}
          height={'100%'}
          width={6}
          bgcolor={'secondary.main'}
        />
        <GoDotFill className={'dot'} />
        <Stack direction={'column'} alignItems={'flex-start'}>
          <Typography>{conversation.gameName}</Typography>
          <Typography fontSize={'0.75rem'} color={'highlight'}>
            {getLastMessage()}
          </Typography>
        </Stack>
      </Stack>
      {conversation.unreadMessageCount > 0 && (
        <Typography
          fontSize={'0.8rem'}
          sx={{
            background: 'var(--mui-palette-secondary-main)',
            borderRadius: 1,
            width: 20,
            height: 20,
            textAlign: 'center',
          }}
        >
          {conversation.unreadMessageCount}
        </Typography>
      )}
      <CustomIconButton sx={{ p: 1 }} onClick={onClickRemoveChat}>
        <FaX size={12} />
      </CustomIconButton>
    </Stack>
  );
};
