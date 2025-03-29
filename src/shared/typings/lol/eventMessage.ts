import { ClientEndpointResponse } from '@shared/typings/lol/clientEndpointResponse';

export interface EventMessage<T = unknown> {
  uri: string;
  eventType: 'Update';
  data: T;
}

export interface EventMessageMap extends ClientEndpointResponse {
  all: unknown;
}
