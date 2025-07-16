import { electronHandle } from '@render/utils/electronFunction.util';
import {
  ClientMakeRequestMethod,
  ClientMakeRequestResponse,
} from '@shared/typings/ipc-function/handle/client.typing';
import {
  ClientEndpointKeys,
  ClientEndpointRequest,
  ClientEndpointResponse,
} from '@shared/typings/lol/clientEndpoint';

export const useLeagueClientRequest = () => {
  const makeRequest = async <K extends ClientEndpointKeys>(
    method: ClientMakeRequestMethod,
    uri: K,
    data: ClientEndpointRequest[K],
  ) => {
    return (await electronHandle.client.makeRequest({
      method,
      uri,
      data,
    })) as unknown as ClientMakeRequestResponse<ClientEndpointResponse[K]>;
  };

  return {
    makeRequest,
  };
};
