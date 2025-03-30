import {
  electronListen,
  useElectronHandle,
} from '@render/utils/electronFunction.util';
import {
  EventMessage,
  EventMessageMap,
} from '@shared/typings/lol/eventMessage';
import { useCallback, useEffect } from 'react';

interface Options {
  makeInitialRequest: boolean;
}

export const useLeagueClientEvent = <K extends keyof EventMessageMap>(
  event: K,
  cb: (data: EventMessageMap[K], event: K) => void,
  options?: Partial<Options>,
) => {
  const { client } = useElectronHandle();

  const currentOptions = Object.assign(
    {
      makeInitialRequest: true,
    } as Options,
    options,
  );

  const readMessage = useCallback(
    (eventData: EventMessage) => {
      if (eventData.uri === event || event === 'all') {
        // @ts-ignore
        cb(eventData.data, eventData.uri);
      }
    },
    [cb],
  );

  useEffect(() => {
    const { unsubscribe } = electronListen.onLeagueClientEvent((message) => {
      // @ts-ignore
      readMessage(message[2]);
    });
    if (event !== 'all' && currentOptions?.makeInitialRequest) {
      client
        .makeRequest({
          method: 'GET',
          uri: event,
          data: undefined,
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
  }, [readMessage, currentOptions?.makeInitialRequest]);
};
