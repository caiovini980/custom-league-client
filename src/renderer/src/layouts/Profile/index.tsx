import { ProfileView } from '@render/layouts/Profile/ProfileView';
import { useStore } from '@render/zustand/store';

export const Profile = () => {
  const currentSummoner = useStore().currentSummoner.info();

  if (!currentSummoner) return;

  return <ProfileView summonerId={currentSummoner.summonerId} />;
};
