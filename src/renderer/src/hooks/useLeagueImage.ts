import { Undefined } from '@shared/typings/generic.typing';
import { gameDataStore } from '@render/zustand/stores/gameDataStore';

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
  const champions = gameDataStore.champions.use();
  const spells = gameDataStore.spells.use();
  const items = gameDataStore.items.use();

  const link = (path: string, isLocal = false) => {
    if (!path) return '';
    if (isLocal) {
      return `local-media://${path.replace('plugins/rcp-be-lol-game-data/global/default', 'lol-game-data/assets')}`;
    }
    return `media://${path}`;
  };

  const profileIcon = (id: Undefined<Id>) => {
    if (id === undefined) id = 0;
    return lolGameDataImg(`v1/profile-icons/${id}.jpg`);
  };

  const lolGameDataImg = (url: string) => {
    const urlNormalize = url.toLowerCase().replace('lol-game-data/assets/', '');
    return link(
      `plugins/rcp-be-lol-game-data/global/default/${urlNormalize}`.replace(
        '//',
        '/',
      ),
      true,
    );
  };

  const championIcon = (id: Id) => {
    return lolGameDataImg(`v1/champion-icons/${id || -1}.png`);
  };

  const spellIcon = (id: Id) => {
    const spellPath = spells.find((s) => String(s.id) === String(id));
    if (spellPath) {
      return lolGameDataImg(spellPath.iconPath);
    }
    return '';
  };

  const itemIcon = (id: Id) => {
    const item = items.find((i) => String(i.id) === String(id));
    if (item) {
      return lolGameDataImg(item.iconPath);
    }
    return '';
  };

  const tierImg = (tier: Tier) => {
    if (!tier) tier = 'unranked';
    return link(
      `plugins/rcp-fe-lol-shared-components/global/default/${tier.toLowerCase()}.png`,
    );
  };

  const genericImg = (iconPath: string) => {
    return link(iconPath);
  };

  const positionIcon = (position: string) => {
    return link(
      `/plugins/rcp-fe-lol-parties/global/default/icon-position-banner-primary-${position.toLowerCase()}.png`,
    );
  };

  const loadChampionBackgroundImg = (
    art:
      | 'loadScreenPath'
      | 'splashPath'
      | 'tilePath'
      | 'uncenteredSplashPath'
      | 'splashVideoPath',
    championId: number,
    skinId = 0,
  ) => {
    const championSkins = champions.find((c) => c.id === championId)?.skins;
    if (championSkins) {
      let skin = championSkins.find((s) => s.id === skinId);
      if (!skin) {
        skin = championSkins[0];
      }
      const skinPath = skin[art] ?? skin.splashPath;
      return lolGameDataImg(skinPath.slice(1));
    }
    return '';
  };

  return {
    profileIcon,
    lolGameDataImg,
    championIcon,
    spellIcon,
    itemIcon,
    tierImg,
    genericImg,
    positionIcon,
    loadChampionBackgroundImg,
  };
};
