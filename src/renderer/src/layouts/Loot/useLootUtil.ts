import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { LolLootV1PlayerLoot } from '@shared/typings/lol/response/lolLootV1PlayerLoot';

export const useLootUtil = () => {
  const { genericImg, lolGameDataImg } = useLeagueImage();
  const { rcpFeLolLoot } = useLeagueTranslate();

  const { rcpFeLolLootTrans } = rcpFeLolLoot;

  const getLootName = (loot: LolLootV1PlayerLoot) => {
    if (loot.localizedName) return loot.localizedName;
    if (loot.itemDesc) return loot.itemDesc;
    return rcpFeLolLootTrans(`loot_name_${loot.lootId.toLowerCase()}`);
  };

  const getLootDescription = (loot: LolLootV1PlayerLoot) => {
    if (loot.localizedDescription) return loot.localizedDescription;
    return rcpFeLolLootTrans(`loot_description_${loot.lootId}`);
  };

  const getLootImg = (loot: LolLootV1PlayerLoot) => {
    if (loot.splashPath.startsWith('/fe')) {
      return genericImg(
        `plugins/rcp-fe-lol-loot/global/default/${loot.splashPath.replace('/fe/lol-loot/', '')}`,
      );
    }
    return lolGameDataImg(loot.splashPath);
  };

  return {
    getLootName,
    getLootDescription,
    getLootImg,
  };
};
