import { ClientEndpointResponse } from '@shared/typings/lol/clientEndpointResponse';

export interface ClientMakeRequestPayload {
  method: 'POST' | 'GET' | 'DELETE' | 'PUT';
  uri: keyof ClientEndpointResponse;
  data: unknown;
}

export interface ClientMakeRequestResponse<T = unknown> {
  ok: boolean;
  status: number;
  body: T;
}
