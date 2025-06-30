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
  showDeleted?: boolean;
  makeInitialRequest: boolean;
  deps: DependencyList;
}

type Cb<K extends keyof EventMessageMap> = (
  data: EventMessageMap[K],
  event: K,
) => void;

const regexMap = {
  '{id}': '.+',
  '{digits}': '[0-9]+',
  '{string}': '[a-zA-Z]+',
  '{uuid}':
    '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}',
};

const readMessage = <K extends keyof EventMessageMap>(
  event: K,
  eventData: EventMessage,
  cb: Cb<K>,
  showDeleted: boolean,
) => {
  if (eventData.eventType === 'Delete' && !showDeleted) {
    return;
  }
  const eventParsed = Object.keys(regexMap).reduce((prev, curr) => {
    return prev.replaceAll(curr, regexMap[curr]);
  }, event);

  if (
    new RegExp(`^${eventParsed}$`).test(eventData.uri) ||
    eventData.uri === event ||
    event === 'all'
  ) {
    // @ts-ignore
    cb(eventData.data, eventData.uri);
  }
};

export const onLeagueClientEvent = <K extends keyof EventMessageMap>(
  event: K,
  cb: Cb<K>,
  showDeleted: boolean,
) => {
  const { unsubscribe } = electronListen.onLeagueClientEvent((message) => {
    // @ts-ignore
    readMessage(event, message[2], cb, showDeleted);
  });

  return {
    unsubscribe,
  };
};

export const useLeagueClientEvent = <K extends keyof EventMessageMap>(
  event: K,
  cb: (data: EventMessageMap[K], event: K) => void,
  options?: Partial<Options>,
) => {
  const { client } = useElectronHandle();

  const currentOptions = Object.assign(
    {
      showDeleted: false,
      makeInitialRequest: true,
      deps: [],
    } as Options,
    options,
  ) as Required<Options>;

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
            readMessage(
              event,
              {
                uri: event,
                eventType: 'Update',
                data: res.body,
              },
              cb,
              currentOptions.showDeleted,
            );
          }
        });
    }
  }, [
    event,
    currentOptions.makeInitialRequest,
    currentOptions.showDeleted,
    ...currentOptions.deps,
  ]);

  useEffect(() => {
    const { unsubscribe } = onLeagueClientEvent(
      event,
      cb,
      currentOptions.showDeleted,
    );
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
    return String(prev).replace(/\{.+?}/, String(curr));
  }, url) as K;
};
