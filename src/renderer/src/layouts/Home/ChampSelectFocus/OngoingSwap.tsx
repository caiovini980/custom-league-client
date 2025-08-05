import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';
import { memo } from 'react';

export const OngoingSwap = () => {
  useLeagueClientEvent(
    '/lol-champ-select/v1/ongoing-pick-order-swap',
    (data) => {
      champSelectStore.setSwapData(data);
    },
  );

  useLeagueClientEvent('/lol-champ-select/v1/ongoing-position-swap', (data) => {
    champSelectStore.setSwapData(data);
  });

  useLeagueClientEvent('/lol-champ-select/v1/ongoing-champion-swap', (data) => {
    champSelectStore.setSwapData(data);
  });

  return <></>;
};

export const OngoingSwapMemo = memo(OngoingSwap);
