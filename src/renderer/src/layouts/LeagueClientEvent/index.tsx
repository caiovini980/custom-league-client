import { electronListen } from '@render/utils/electronFunction.util';
import { useEffect } from 'react';

export const LeagueClientEvent = () => {
  useEffect(() => {
    const { unsubscribe } = electronListen.onLeagueClientEvent((message) => {
      console.log(message);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <></>;
};
