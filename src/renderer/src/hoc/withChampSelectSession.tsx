import { CentralizedStack } from '@render/components/CentralizedStack';
import { LoadingScreen } from '@render/components/LoadingScreen';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';
import { FunctionComponent } from 'react';

export interface ExtendProps {
  enabledLoadingScreen?: boolean;
}

export interface WithChampSelectSessionProps {
  isLegacy: boolean;
}

export const withChampSelectSession = <P,>(
  Component: FunctionComponent<
    WithChampSelectSessionProps & Omit<P, 'session'>
  >,
) => {
  return (props: P & ExtendProps) => {
    const show = champSelectStore.hasSession.use();
    const isLegacy = champSelectStore.isLegacy.use();

    if (!show) {
      if (props.enabledLoadingScreen) {
        return (
          <CentralizedStack>
            <LoadingScreen />
          </CentralizedStack>
        );
      }
      return null;
    }

    return <Component {...props} isLegacy={isLegacy} />;
  };
};
