import { useStore } from '@render/zustand/store';

export const useLeagueImage = () => {
  const filePath = useStore().leagueClient.filePath();
  const championList = useStore().champion.champions();

  const getFileLocal = () => {
    if (filePath) return `media://${filePath}`;
    return 'https://raw.communitydragon.org/latest';
  };

  const profileIcon = (id: string | number) => {
    return `${getFileLocal()}/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${id}.jpg`;
  };

  const championSplash = (championKey: string, splashId: string) => {
    const champion = championList.find((c) => c.key === championKey);
    if (!champion) return '';
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_${splashId}.jpg`;
  };

  const lolGameDataImg = (url: string) => {
    return `${getFileLocal()}/plugins/rcp-be-lol-game-data/global/default/${url.replace('/lol-game-data/assets/', '').toLowerCase()}`;
  };

  return {
    profileIcon,
    championSplash,
    lolGameDataImg,
  };
};
