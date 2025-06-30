import { ProfileView } from '@render/layouts/Profile/ProfileView';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';

export const Profile = () => {
  const currentSummoner = currentSummonerStore.info.use();

  if (!currentSummoner) return;

  return <ProfileView summonerId={currentSummoner.summonerId} />;
};
