import { useStore } from '@render/zustand/store';

export const useLeagueImage = () => {
  const version = useStore().leagueClient.version();

  const profileIcon = (id: string | number) => {
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${id}.png`;
  };

  return {
    profileIcon,
  };
};
