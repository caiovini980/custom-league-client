import { Stack, Typography } from '@mui/material';
import { CustomIconButtonTooltip } from '@render/components/input';
import { useStore } from '@render/zustand/store';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { Perk } from '@shared/typings/lol/json/perk';
import { PerkStyles } from '@shared/typings/lol/json/perkStyles';
import { CircularIcon } from '@render/components/CircularIcon';
import { PerkEdit } from '@render/layouts/Lobby/ChampSelect/CenterArea/Runes/RuneEdit';

interface SlotPerksProps {
  type: 'primary' | 'secondary' | 'stat';
  handleEditPerk: (values: Partial<PerkEdit>) => void;
  perkEdit: PerkEdit;
}

export const SlotPerks = ({
  type,
  perkEdit,
  handleEditPerk,
}: SlotPerksProps) => {
  const { lolGameDataImg } = useLeagueImage();
  const perks = useStore().gameData.perks();
  const perkStyles = useStore().gameData.perkStyles();

  const iconSize = 30;

  const getPerkById = (perkId: number) => {
    return perks.find((p) => p.id === perkId) as Perk;
  };

  const getPerkStyleById = (perkStylesId: number) => {
    return perkStyles.find((ps) => ps.id === perkStylesId) as PerkStyles;
  };

  const getPerkStyles = () => {
    if (type === 'secondary') {
      return perkStyles.filter((ps) =>
        getPerkStyleById(perkEdit.primaryPerkId).allowedSubStyles.includes(
          ps.id,
        ),
      );
    }
    return perkStyles;
  };

  const getSlots = () => {
    if (type === 'primary') {
      return getPerkStyleById(perkEdit.primaryPerkId).slots.filter(
        (s) => s.type !== 'kStatMod',
      );
    }
    if (type === 'secondary') {
      return getPerkStyleById(perkEdit.secondaryPerkId).slots.filter(
        (s) => s.type === 'kMixedRegularSplashable',
      );
    }
    return getPerkStyleById(perkEdit.secondaryPerkId).slots.filter(
      (s) => s.type === 'kStatMod',
    );
  };

  const renderTooltipPerkStyle = (perk: PerkStyles) => {
    return (
      <Stack direction={'column'}>
        <Typography fontSize={'1.2rem'}>{perk.name}</Typography>
        <Typography color={'textSecondary'}>{perk.tooltip}</Typography>
      </Stack>
    );
  };

  const renderTooltipPerk = (perk: Perk) => {
    return (
      <Stack direction={'column'}>
        <Typography fontSize={'1.2rem'}>{perk.name}</Typography>
        <Typography
          color={'textSecondary'}
          dangerouslySetInnerHTML={{ __html: perk.longDesc }}
        />
      </Stack>
    );
  };

  const getCurrentPerkId = () => {
    if (type === 'primary') return perkEdit.primaryPerkId;
    if (type === 'secondary') return perkEdit.secondaryPerkId;
    return -1;
  };

  const getPerkSelected = () => {
    if (type === 'primary') return perkEdit.primarySlotPerksId;
    if (type === 'secondary') return perkEdit.secondarySlotPerksId;
    return perkEdit.statSlotPerksId;
  };

  const onClickPerkStyle = (perkId: number) => {
    if (type === 'primary') {
      if (perkId === perkEdit.secondaryPerkId) {
        handleEditPerk({
          primaryPerkId: perkId,
          primarySlotPerksId: [],
          secondaryPerkId: perkEdit.primaryPerkId,
          secondarySlotPerksId: [],
        });
      } else {
        handleEditPerk({
          primaryPerkId: perkId,
          primarySlotPerksId: [],
        });
      }
    }

    if (type === 'secondary') {
      handleEditPerk({
        secondaryPerkId: perkId,
        secondarySlotPerksId: [],
      });
    }
  };

  const onClickSlotPerk = (perkIndex: number, perkId: number) => {
    const getNewPerkIdList = (perksId: number[]) => {
      if (type === 'secondary') {
        const arr = perksId.filter(
          (pId) => !getSlots()[perkIndex].perks.includes(pId),
        );
        if (arr.length > 1) arr.shift();
        arr.push(perkId);
        return arr;
      }
      const amountSlot = getSlots().length;
      const newArray = new Array(amountSlot).fill(0);
      return newArray.map((_, index) => {
        if (perkIndex === index) return perkId;
        return perksId[index];
      });
    };
    if (type === 'primary') {
      handleEditPerk({
        primarySlotPerksId: getNewPerkIdList(perkEdit.primarySlotPerksId),
      });
    }
    if (type === 'secondary') {
      handleEditPerk({
        secondarySlotPerksId: getNewPerkIdList(perkEdit.secondarySlotPerksId),
      });
    }
    if (type === 'stat') {
      handleEditPerk({
        statSlotPerksId: getNewPerkIdList(perkEdit.statSlotPerksId),
      });
    }
  };

  return (
    <Stack direction={'column'} rowGap={3}>
      {type !== 'stat' && (
        <Stack direction={'row'} justifyContent={'space-between'}>
          {getPerkStyles().map((perk) => {
            return (
              <CustomIconButtonTooltip
                key={perk.id}
                title={renderTooltipPerkStyle(perk)}
                placement={'top'}
                onClick={() => onClickPerkStyle(perk.id)}
                sx={{
                  background: (t) =>
                    getCurrentPerkId() === perk.id
                      ? t.palette.action.selected
                      : undefined,
                }}
              >
                <CircularIcon
                  src={lolGameDataImg(perk.iconPath)}
                  size={iconSize}
                />
              </CustomIconButtonTooltip>
            );
          })}
        </Stack>
      )}
      {getSlots().map((slot, i) => (
        <Stack
          key={i}
          direction={'row'}
          justifyContent={'space-between'}
          columnGap={0.5}
        >
          {slot.perks.map((perkId) => {
            const perk = getPerkById(perkId);
            const perkSelected =
              slot.type === 'kStatMod'
                ? getPerkSelected()[i] === perk.id
                : getPerkSelected().includes(perk.id);

            const enableGrayScale = () => {
              const enable = !perkSelected && !!getPerkSelected()[i];
              if (type === 'secondary' && !perkSelected) {
                return getPerkSelected().length === 2;
              }
              return enable;
            };

            return (
              <CustomIconButtonTooltip
                key={perk.id}
                title={renderTooltipPerk(perk)}
                onClick={() => onClickSlotPerk(i, perk.id)}
                placement={'bottom'}
                disableInteractive
                sx={{
                  background: (t) =>
                    perkSelected ? t.palette.action.selected : undefined,
                }}
              >
                <CircularIcon
                  src={lolGameDataImg(perk.iconPath)}
                  grayScale={enableGrayScale()}
                  size={slot.type === 'kKeyStone' ? 40 : iconSize}
                />
              </CustomIconButtonTooltip>
            );
          })}
        </Stack>
      ))}
    </Stack>
  );
};
