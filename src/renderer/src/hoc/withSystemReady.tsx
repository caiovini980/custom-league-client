import { CentralizedStack } from '@render/components/CentralizedStack';
import { LoadingScreen } from '@render/components/LoadingScreen';
import {
  LeagueClientState,
  leagueClientStore,
} from '@render/zustand/stores/leagueClientStore';
import { FunctionComponent } from 'react';

export const withSystemReady = <P,>(
  system: keyof LeagueClientState['systemReady'],
  Component: FunctionComponent<P>,
) => {
  return (props: P) => {
    const systemReady = leagueClientStore.systemReady[system].use();

    if (!systemReady) {
      return (
        <CentralizedStack>
          <LoadingScreen />
        </CentralizedStack>
      );
    }

    // @ts-ignore
    return <Component {...props} />;
  };
};
