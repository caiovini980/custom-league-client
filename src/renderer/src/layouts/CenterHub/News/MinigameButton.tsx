import { CustomButton } from '@render/components/input';
import { minigameStore } from '@render/zustand/stores/minigameStore';
import { LolActivityCenterV1Content_IdBladeItem } from '@shared/typings/lol/response/lolActivityCenterV1Content_Id';

interface MinigameButtonProps {
  item: LolActivityCenterV1Content_IdBladeItem;
}

export const MinigameButton = ({ item }: MinigameButtonProps) => {
  const link = minigameStore.data.use();
  const showButtonInTabId = minigameStore.showButtonInTabId.use();

  const showButton = item.header.links.some(
    (l) => l.action.payload.tabId === showButtonInTabId,
  );

  if (link && showButton) {
    return (
      <CustomButton
        variant={'contained'}
        onClick={() => minigameStore.open.set(true)}
      >
        {link.title}
      </CustomButton>
    );
  }
  return null;
};
