import { useStore } from '@render/zustand/store';

type Id = string | number;
type Tier =
  | string
  | 'iron'
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'emerald'
  | 'platinum'
  | 'grandmaster'
  | 'master'
  | 'challenger';

export const useLeagueImage = () => {
  const version = useStore().leagueClient.version();
  const spells = useStore().gameData.spells();
  const items = useStore().gameData.items();

  const link = (path: string) => {
    return `media://${version}/${path}`;
  };

  const profileIcon = (id: Id) => {
    return link(
      `plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${id}.jpg`,
    );
  };

  const lolGameDataImg = (url: string) => {
    return link(
      `plugins/rcp-be-lol-game-data/global/default/${url.replace('/lol-game-data/assets/', '').toLowerCase()}`,
    );
  };

  const championIcon = (id: Id) => {
    return link(
      `plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${id}.png`,
    );
  };

  const spellIcon = (id: Id) => {
    const spellPath = spells.find((s) => String(s.id) === String(id));
    if (spellPath) {
      return lolGameDataImg(spellPath.iconPath.toLowerCase());
    }
    return '';
  };

  const itemIcon = (id: Id) => {
    const item = items.find((i) => String(i.id) === String(id));
    if (item) {
      return lolGameDataImg(item.iconPath.toLowerCase());
    }
    return '';
  };

  const tierImg = (tier: Tier) => {
    if (!tier) tier = 'unranked';
    return link(
      `plugins/rcp-fe-lol-shared-components/global/default/${tier.toLowerCase()}.png`,
    );
  };

  return {
    profileIcon,
    lolGameDataImg,
    championIcon,
    spellIcon,
    itemIcon,
    tierImg,
  };
};
