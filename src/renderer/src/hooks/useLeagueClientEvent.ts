import {
  electronListen,
  useElectronHandle,
} from '@render/utils/electronFunction.util';
import {
  EventMessage,
  EventMessageMap,
} from '@shared/typings/lol/eventMessage';
import { DependencyList, useCallback, useEffect } from 'react';

export const useLeagueClientEvent = <K extends keyof EventMessageMap>(
  event: K,
  cb: (data: EventMessageMap[K], event: K) => void,
  deps: DependencyList = [],
) => {
  const { client } = useElectronHandle();

  const readMessage = useCallback(
    (eventData: EventMessage) => {
      if (eventData.uri === event || event === 'all') {
        // @ts-ignore
        cb(eventData.data, eventData.uri);
      }
    },
    [...deps, cb],
  );

  useEffect(() => {
    const { unsubscribe } = electronListen.onLeagueClientEvent((message) => {
      // @ts-ignore
      readMessage(message[2]);
    });
    if (event !== 'all') {
      client
        .makeRequest({
          method: 'GET',
          uri: event,
          data: {},
        })
        .then((res) => {
          if (res.ok) {
            readMessage({
              uri: event,
              eventType: 'Update',
              data: res.body,
            });
          }
        });
    }

    return () => {
      unsubscribe();
    };
  }, [readMessage]);
};
