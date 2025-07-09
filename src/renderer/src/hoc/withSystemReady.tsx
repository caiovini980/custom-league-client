import { FunctionComponent } from 'react';
import {
  LeagueClientState,
  leagueClientStore,
} from '@render/zustand/stores/leagueClientStore';
import { CentralizedStack } from '@render/components/CentralizedStack';
import { LoadingScreen } from '@render/components/LoadingScreen';

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
