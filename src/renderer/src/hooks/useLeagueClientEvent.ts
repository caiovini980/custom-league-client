import {
  electronListen,
  useElectronHandle,
} from '@render/utils/electronFunction.util';
import {
  EventMessage,
  EventMessageMap,
} from '@shared/typings/lol/eventMessage';
import { DependencyList, useCallback, useEffect } from 'react';

interface Options {
  makeInitialRequest: boolean;
  deps: DependencyList;
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
      deps: [],
    } as Options,
    options,
  );

  const regexMap = {
    '{digits}': '[0-9]+',
    '{uuid}':
      '[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}',
  };

  const readMessage = useCallback(
    (eventData: EventMessage) => {
      if (eventData.eventType === 'Delete') return;
      const eventParsed = Object.keys(regexMap).reduce((prev, curr) => {
        return prev.replace(curr, regexMap[curr]);
      }, event);
      if (
        new RegExp(`^${eventParsed}$`).test(eventData.uri) ||
        eventData.uri === event ||
        event === 'all'
      ) {
        // @ts-ignore
        cb(eventData.data, eventData.uri);
      }
    },
    [event, ...currentOptions.deps],
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
  }, [loadEventData]);

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
