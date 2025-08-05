import { useAudio } from '@render/hooks/useAudioManager';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useViewActionButtonContext } from '@render/layouts/Home/ViewActions/ViewActionButton';
import { electronHandle } from '@render/utils/electronFunction.util';
import { JSX } from 'react';

export const ConversionListener = (): JSX.Element => {
  const actionButtonContext = useViewActionButtonContext();
  const { replay } = useAudio('sfx-soc-notif-chat-rcvd');

  const { loadEventData } = useLeagueClientEvent(
    '/lol-chat/v1/conversations',
    (data) => {
      const unreadAmount = data
        .filter((d) => d.type === 'chat')
        .filter((d) => d.gameName)
        .reduce((sum, curr) => sum + curr.unreadMessageCount, 0);
      actionButtonContext.setBadge(unreadAmount);
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
        actionButtonContext.forceOpen();
      } else {
        actionButtonContext.forceClose();
      }
    },
    {
      showDeleted: true,
    },
  );

  return <></>;
};
