import useFirstRender from '@render/hooks/useFirstRender';
import {
  electronHandle,
  electronListen,
} from '@render/utils/electronFunction.util';
import {
  EventMessage,
  EventMessageMap,
} from '@shared/typings/lol/eventMessage';
import {
  buildRegexFromEvent,
  hasKeyRegex,
} from '@shared/utils/leagueClientEvent.util';
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
    cb(eventData.data as EventMessageMap[K], eventData.uri as K);
  }
};

export const onLeagueClientEvent = <K extends keyof EventMessageMap>(
  event: K,
  cb: Cb<K>,
  showDeleted: boolean,
): { unsubscribe: () => void } => {
  const regex = buildRegexFromEvent(event);
  return electronListen.onLeagueClientEvent((message) => {
    readMessage(regex, message, cb, showDeleted);
  }, event);
};

export const useLeagueClientEvent = <K extends keyof EventMessageMap>(
  event: K,
  cb: (data: EventMessageMap[K], event: K) => void,
  options?: Partial<Options>,
) => {
  const { isFirstRender } = useFirstRender();

  const currentOptions = Object.assign(
    {
      showDeleted: false,
      makeInitialRequest: true,
      deps: [],
    } as Options,
    options,
  ) as Required<Options>;

  const loadEventData = useCallback(() => {
    if (event !== 'all' && !hasKeyRegex(event)) {
      electronHandle.client
        .makeRequest({
          method: 'GET',
          uri: event,
          data: undefined,
        })
        .then((res) => {
          if (res.ok) {
            cb(res.body as EventMessageMap[K], event);
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

    return () => {
      unsubscribe();
    };
  }, [event, ...currentOptions.deps]);

  useEffect(() => {
    if (isFirstRender && !currentOptions?.makeInitialRequest) return;
    loadEventData();
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
