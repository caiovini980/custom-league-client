import { VersionModal } from '@render/layouts/BottomBar/Version/VersionModal';
import { VersionButton } from '@render/layouts/BottomBar/Version/VersionButton';
import { VersionContext } from '@render/layouts/BottomBar/Version/VersionContext';

export const Version = () => {
  return (
    <VersionContext>
      <VersionButton />
      <VersionModal />
    </VersionContext>
  );
};
