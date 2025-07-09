import { leagueClientStore } from '@render/zustand/stores/leagueClientStore';
import { FunctionComponent } from 'react';

export const withClientConnected = <P,>(Component: FunctionComponent<P>) => {
  return (props: P) => {
    const isConnected = leagueClientStore.isConnected.use();

    if (!isConnected) {
      return null;
    }
    // @ts-ignore
    return <Component {...props} />;
  };
};
