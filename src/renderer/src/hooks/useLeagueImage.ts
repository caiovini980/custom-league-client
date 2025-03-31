import { useStore } from '@render/zustand/store';

export const useLeagueImage = () => {
  const version = useStore().leagueClient.version();
  const championList = useStore().champion.champions();

  const profileIcon = (id: string | number) => {
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${id}.png`;
  };

  const championSplash = (championKey: string, splashId: string) => {
    const champion = championList.find((c) => c.key === championKey);
    if (!champion) return '';
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_${splashId}.jpg`;
  };

  const lolGameDataImg = (url: string) => {
    return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${url.replace('/lol-game-data/assets/', '').toLowerCase()}`;
  };

  return {
    profileIcon,
    championSplash,
    lolGameDataImg,
  };
};
