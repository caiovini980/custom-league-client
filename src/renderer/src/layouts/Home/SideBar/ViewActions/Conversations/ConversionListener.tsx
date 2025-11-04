import { useAudio } from '@render/hooks/useAudioManager';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useViewActionButtonContext } from '@render/layouts/Home/SideBar/ViewActions/ViewActionButton';
import { electronHandle } from '@render/utils/electronFunction.util';
import { chatStore } from '@render/zustand/stores/chatStore';
import { orderBy } from 'lodash-es';
import { JSX, useEffect } from 'react';

export const ConversionListener = (): JSX.Element => {
  const { makeRequest } = useLeagueClientRequest();
  const actionButtonContext = useViewActionButtonContext();
  const { replay } = useAudio('sfx-soc-notif-chat-rcvd');

  const { loadEventData } = useLeagueClientEvent(
    '/lol-chat/v1/conversations',
    (data) => {
      const unreadAmount = data
        .filter((d) => d.type === 'chat')
        .filter((d) => d.gameName)
        .reduce((sum, curr) => sum + curr.unreadMessageCount, 0);
      const filtered = orderBy(
        data.filter((d) => d.type === 'chat').filter((d) => d.gameName),
        (d) => d.unreadMessageCount,
        'desc',
      );
      actionButtonContext.setBadge(unreadAmount);
      chatStore.conversations.set(filtered);
    },
  );

  useLeagueClientEvent(
    '/lol-chat/v1/conversations/{id}/messages/{id}',
    (data) => {
      loadEventData();
      if (data.type !== 'system') {
        replay();
        electronHandle.client.blink();
      }
    },
  );

  useLeagueClientEvent(
    '/lol-chat/v1/conversations/active',
    (data) => {
      loadEventData();
      if (data) {
        chatStore.selectConversationActive(data.id);
        actionButtonContext.forceOpen();
      } else {
        chatStore.conversationActive.set(null);
      }
    },
    {
      showDeleted: true,
    },
  );

  useEffect(() => {
    if (!actionButtonContext.isActive) {
      makeRequest(
        'DELETE',
        '/lol-chat/v1/conversations/active',
        undefined,
      ).then();
    }
  }, [actionButtonContext.isActive]);

  return <></>;
};
