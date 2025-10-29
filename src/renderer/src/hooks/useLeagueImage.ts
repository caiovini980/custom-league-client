import { gameDataStore } from '@render/zustand/stores/gameDataStore';
import { Undefined } from '@shared/typings/generic.typing';

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
  const wards = gameDataStore.wards.use();
  const emotes = gameDataStore.emotes.use();
  const icons = gameDataStore.icons.use();

  const link = (path: string, isLocal = false) => {
    if (!path) return '';
    let url = `media://${path}`;
    if (isLocal) {
      url = `local-media://${path.replace('plugins/rcp-be-lol-game-data/global/default', 'lol-game-data/assets')}`;
    }

    return url;
  };

  const profileIcon = (id: Undefined<Id>) => {
    if (id === undefined) id = 0;
    const icon = icons.find((icon) => icon.id === id);
    if (icon) {
      return lolGameDataImg(icon.imagePath);
    }
    return '';
  };

  const wardIcon = (wardId: number) => {
    const ward = wards.find((ward) => ward.id === wardId);
    if (ward) {
      return lolGameDataImg(ward.wardImagePath);
    }
    return '';
  };

  const emoteIcon = (emoteId: number) => {
    const emote = emotes.find((emote) => emote.id === emoteId);
    if (emote) {
      return lolGameDataImg(emote.inventoryIcon);
    }
    return '';
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
    useSkinBase = false,
  ) => {
    const championSkins = champions.find((c) => c.id === championId)?.skins;
    if (championSkins) {
      let skin = championSkins.find(
        (s) => s.id === skinId || s.chromas?.some((c) => c.id === skinId),
      );

      if (!skin) {
        skin = championSkins[0];
      } else if (skin.id !== skinId && !useSkinBase) {
        const chroma = skin.chromas?.find((c) => c.id === skinId);
        return lolGameDataImg(chroma?.chromaPath ?? '');
      }
      const skinPath = skin[art] ?? skin.splashPath;
      return lolGameDataImg(skinPath.slice(1));
    }
    return '';
  };

  const loadChampionSkin = (skinId: number) => {
    const skin = champions
      .flatMap((c) => c.skins)
      .find((s) => s.id === skinId || s.chromas?.some((c) => c.id === skinId));

    if (skin) {
      if (skin.id !== skinId) {
        const chroma = skin.chromas?.find((c) => c.id === skinId);
        return lolGameDataImg(chroma?.chromaPath ?? '');
      }
      return lolGameDataImg(skin.splashPath);
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
    loadChampionSkin,
    wardIcon,
    emoteIcon,
  };
};
