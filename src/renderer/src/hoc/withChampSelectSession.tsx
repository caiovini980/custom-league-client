import { CentralizedStack } from '@render/components/CentralizedStack';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { LolChampSelectV1Session } from '@shared/typings/lol/response/lolChampSelectV1Session';
import { FunctionComponent } from 'react';

export interface ExtendProps {
  useLoading?: boolean;
}

export interface WithChampSelectSessionProps {
  session: LolChampSelectV1Session;
}

export const withChampSelectSession = <P,>(
  Component: FunctionComponent<
    WithChampSelectSessionProps & Omit<P, 'session'>
  >,
) => {
  return (props: P & ExtendProps) => {
    const session = lobbyStore.champSelect.use();

    if (!session) {
      if (props.useLoading) {
        return (
          <CentralizedStack>
            <LoadingScreen />
          </CentralizedStack>
        );
      }
      return null;
    }
    return <Component {...props} session={session} />;
  };
};
