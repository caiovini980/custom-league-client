import { useElectronHandle } from '@render/utils/electronFunction.util';
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
  const { client } = useElectronHandle();

  const makeRequest = async <K extends ClientEndpointKeys>(
    method: ClientMakeRequestMethod,
    uri: K,
    data: ClientEndpointRequest[K],
  ) => {
    return (await client.makeRequest({
      method,
      uri,
      data,
    })) as unknown as ClientMakeRequestResponse<ClientEndpointResponse[K]>;
  };

  return {
    makeRequest,
  };
};
