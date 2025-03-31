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

  const regexMap = {
    '{digits}': '[0-9]+',
  };

  const readMessage = useCallback(
    (eventData: EventMessage) => {
      const eventParsed = Object.keys(regexMap).reduce((prev, curr) => {
        return prev.replace(curr, regexMap[curr]);
      }, event);
      if (
        new RegExp(`^${eventParsed}$`).test(eventData.uri) ||
        event === 'all'
      ) {
        // @ts-ignore
        cb(eventData.data, eventData.uri);
      }
    },
    [event],
  );

  const loadEventData = useCallback(() => {
    const isRegexKeys = Object.keys(regexMap).some((rk) => event.includes(rk));
    if (event !== 'all' && currentOptions?.makeInitialRequest && !isRegexKeys) {
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
  }, [readMessage, currentOptions?.makeInitialRequest]);

  useEffect(() => {
    const { unsubscribe } = electronListen.onLeagueClientEvent((message) => {
      // @ts-ignore
      readMessage(message[2]);
    });
    loadEventData();

    return () => {
      unsubscribe();
    };
  }, [readMessage, currentOptions?.makeInitialRequest]);

  return {
    loadEventData,
  };
};

export const buildEventUrl = <K extends keyof EventMessageMap>(
  url: K,
  ...params: (string | number)[]
) => {
  return params.reduce((prev, curr) => {
    return String(prev).replace(/\{.+}/, String(curr));
  }, url) as K;
};
