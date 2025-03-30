export const useLeagueImage = () => {
  //const version = useStore().leagueClient.version();

  const profileIcon = (id: string | number) => {
    // TODO: search version and change her. Link: https://developer.riotgames.com/docs/lol#data-dragon
    return `https://ddragon.leagueoflegends.com/cdn/15.6.1/img/profileicon/${id}.png`;
  };

  return {
    profileIcon,
  };
};
