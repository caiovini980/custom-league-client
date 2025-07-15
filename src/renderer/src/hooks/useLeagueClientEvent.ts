import {
  electronListen,
  useElectronHandle,
} from '@render/utils/electronFunction.util';
import {
  EventMessage,
  EventMessageMap,
} from '@shared/typings/lol/eventMessage';
import { DependencyList, useCallback, useEffect, useMemo } from 'react';
import useFirstRender from '@render/hooks/useFirstRender';

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
  '{string}': '[a-zA-Z_]+',
  '{uuid}':
    '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}',
};

const readMessage = <K extends keyof EventMessageMap>(
  event: RegExp,
  eventData: EventMessage,
  cb: Cb<K>,
  showDeleted: boolean,
) => {
  if (eventData.eventType === 'Delete' && !showDeleted) {
    return;
  }

  if (event.test(eventData.uri)) {
    // @ts-ignore
    cb(eventData.data, eventData.uri);
  }
};

const buildRegex = (event: string) => {
  if (event === 'all') {
    return /.*/;
  }
  const eventParsed = Object.keys(regexMap).reduce((prev, curr) => {
    return prev.replaceAll(curr, regexMap[curr]);
  }, event);

  return new RegExp(`^${eventParsed}$`);
};

export const onLeagueClientEvent = <K extends keyof EventMessageMap>(
  event: K,
  cb: Cb<K>,
  showDeleted: boolean,
) => {
  const regex = buildRegex(event);
  const { unsubscribe } = electronListen.onLeagueClientEvent((message) => {
    // @ts-ignore
    readMessage(regex, message[2], cb, showDeleted);
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
  const { isFirstRender } = useFirstRender();

  const currentOptions = Object.assign(
    {
      showDeleted: false,
      makeInitialRequest: true,
      deps: [],
    } as Options,
    options,
  ) as Required<Options>;

  const regexEvent = useMemo(() => buildRegex(event), [event]);

  const loadEventData = useCallback(() => {
    if (event !== 'all' && regexEvent.test(event)) {
      client
        .makeRequest({
          method: 'GET',
          uri: event,
          data: undefined,
        })
        .then((res) => {
          if (res.ok) {
            readMessage(
              regexEvent,
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
    regexEvent,
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
    if (currentOptions?.makeInitialRequest && isFirstRender) {
      loadEventData();
    }

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
    return String(prev).replace(/\{.+?}/, encodeURIComponent(String(curr)));
  }, url) as K;
};
