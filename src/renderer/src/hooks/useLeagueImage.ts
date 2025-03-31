export const useLeagueImage = () => {
  const profileIcon = (id: string | number) => {
    return `media://plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${id}.jpg`;
  };

  const lolGameDataImg = (url: string) => {
    return `media://plugins/rcp-be-lol-game-data/global/default/${url.replace('/lol-game-data/assets/', '').toLowerCase()}`;
  };

  return {
    profileIcon,
    lolGameDataImg,
  };
};
