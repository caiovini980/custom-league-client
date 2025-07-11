import { ClientEndpointResponse } from '@shared/typings/lol/clientEndpoint';

export interface EventMessage<T = unknown> {
  uri: string;
  eventType: 'Update' | 'Delete';
  data: T;
}

export interface EventMessageMap extends ClientEndpointResponse {
  all: unknown;
}
