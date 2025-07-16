import { Box, Divider, Stack, Typography } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import CustomDialog, {
  CustomDialogCloseFloatingButton,
} from '@render/components/CustomDialog';
import { CustomButton } from '@render/components/input';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useLootContext } from '@render/layouts/Loot/LootContext';
import { useLootUtil } from '@render/layouts/Loot/useLootUtil';
import { LolLootV1PlayerLoot } from '@shared/typings/lol/response/lolLootV1PlayerLoot';
import { LolLootV1PlayerLoot_Id_ContextMenu } from '@shared/typings/lol/response/lolLootV1PlayerLoot_Id_ContextMenu';
import { forwardRef, useImperativeHandle, useState } from 'react';

interface LootActionModalProps {
  loot: LolLootV1PlayerLoot;
}

export interface LootActionModalRef {
  open: (menu: LolLootV1PlayerLoot_Id_ContextMenu) => void;
}

export const LootActionModal = forwardRef<
  LootActionModalRef,
  LootActionModalProps
>(({ loot }, ref) => {
  const { makeRequest } = useLeagueClientRequest();
  const { genericImg } = useLeagueImage();
  const { rcpFeLolLoot } = useLeagueTranslate();
  const { getLootName, getLootImg } = useLootUtil();
  const { showLoots } = useLootContext();

  const { rcpFeLolLootTrans } = rcpFeLolLoot;

  const [menu, setMenu] = useState<LolLootV1PlayerLoot_Id_ContextMenu>();
  const [openModal, setOpenModal] = useState(false);
  const [isAction, setIsAction] = useState(false);

  const isSkinOrChampion = [
    'SKIN',
    'SKIN_RENTAL',
    'CHAMPION',
    'CHAMPION_RENTAL',
    'STATSTONE',
    'STATSTONE_SHARD',
  ].includes(loot.type);

  const getBackgroundImg = () => {
    if (isSkinOrChampion) {
      return getLootImg(loot);
    }
    return genericImg('plugins/rcp-fe-lol-loot/global/default/background.jpg');
  };

  const getActionText = () => {
    if (!menu) return '';
    if (menu.actionType === 'DISENCHANT') {
      const desc = rcpFeLolLootTrans('loot_disenchant_description');
      return `${loot.disenchantValue}  ${desc}`;
    }
    if (menu.actionType === 'UPGRADE') {
      return rcpFeLolLootTrans(
        `loot_recipe_requirement_${menu.name.toLowerCase()}`,
        loot.upgradeEssenceValue,
      );
    }
    return '';
  };

  const getButtonLabel = () => {
    if (!menu) return '';
    return rcpFeLolLootTrans(
      `loot_recipe_button_${menu.actionType.toLowerCase()}`,
    );
  };

  const onClickAction = () => {
    if (!menu) return;
    setIsAction(true);
    const lootNames = [loot.lootId];

    if (menu.actionType === 'UPGRADE') {
      lootNames.push(menu.essenceType);
    }

    makeRequest('POST', '/lol-loot/v1/craft/mass', [
      {
        recipeName: menu.name,
        repeat: 1,
        lootNames,
      },
    ]).then((res) => {
      setIsAction(false);
      if (res.ok) {
        showLoots(res.body);
        setOpenModal(false);
      }
    });
  };

  useImperativeHandle(ref, () => {
    return {
      open: (menu) => {
        setOpenModal(true);
        setMenu(menu);
      },
    };
  }, []);

  return (
    <CustomDialog
      open={openModal}
      actionsComponent={<div />}
      maxWidth={'sm'}
      fullWidth
      dialogContentProps={{
        sx: {
          p: 0,
          position: 'relative',
        },
      }}
    >
      <CustomDialogCloseFloatingButton
        handleClose={() => setOpenModal(false)}
      />
      <Stack
        direction={'column'}
        alignItems={'center'}
        justifyContent={'flex-end'}
        width={'100%'}
        height={420}
        rowGap={1}
        p={1}
        sx={{
          background: `linear-gradient(0deg, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0) 80%), url(${getBackgroundImg()})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Box
          display={isSkinOrChampion ? 'none' : undefined}
          sx={{
            height: 200,
            width: '100%',
            background: `url(${getLootImg(loot)})`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <Divider orientation={'horizontal'} flexItem>
          <Typography fontSize={'1.6rem'}>{getLootName(loot)}</Typography>
        </Divider>
        <Stack direction={'row'} columnGap={0.5} alignItems={'center'}>
          <CircularIcon
            src={genericImg(
              `plugins/rcp-fe-lol-loot/global/default/assets/tray_icons/${loot.disenchantLootName.toLowerCase()}.png`,
            )}
            size={18}
          />
          <Typography>{getActionText()}</Typography>
        </Stack>
        <CustomButton
          variant={'outlined'}
          onClick={onClickAction}
          loading={isAction}
        >
          {getButtonLabel()}
        </CustomButton>
      </Stack>
    </CustomDialog>
  );
});
