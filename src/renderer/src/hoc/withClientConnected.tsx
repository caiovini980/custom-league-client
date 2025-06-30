import { FunctionComponent } from 'react';
import { leagueClientStore } from '@render/zustand/stores/leagueClientStore';

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
