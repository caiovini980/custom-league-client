import { ClientEndpointRequest } from '@shared/typings/lol/clientEndpoint';

export type ClientMakeRequestMethod =
  | 'POST'
  | 'GET'
  | 'DELETE'
  | 'PUT'
  | 'PATCH';

export interface ClientMakeRequestPayload<
  K extends keyof ClientEndpointRequest | string,
> {
  method: ClientMakeRequestMethod;
  uri: K;
  data: K extends keyof ClientEndpointRequest
    ? ClientEndpointRequest[K]
    : unknown;
}

export interface ClientMakeRequestResponse<T = unknown> {
  ok: boolean;
  status: number;
  body: T;
}

export interface GetPatchNotesResponse {
  urlExternal: string;
  urlEmbed: string;
  img: string;
  title: string;
  description: string;
}
