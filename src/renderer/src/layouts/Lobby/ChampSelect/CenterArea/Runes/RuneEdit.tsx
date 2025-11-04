import { Divider, Stack, Typography } from '@mui/material';
import { CustomIconButton, CustomTextField } from '@render/components/input';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useSnackNotification } from '@render/hooks/useSnackNotification';
import { SlotPerks } from '@render/layouts/Lobby/ChampSelect/CenterArea/Runes/SlotPerks';
import { LolPerksV1Pages } from '@shared/typings/lol/response/lolPerksV1Pages';
import { useEffect, useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { FaPlus, FaTrash } from 'react-icons/fa6';

export interface PerkEdit {
  id: number;
  name: string;
  isValid: boolean;
  primaryPerkId: number;
  secondaryPerkId: number;
  primarySlotPerksId: number[];
  secondarySlotPerksId: number[];
  statSlotPerksId: number[];
}

interface RuneEditProps {
  pageRuneId: number;
}

export const RuneEdit = ({ pageRuneId }: RuneEditProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { genericImg } = useLeagueImage();
  const { rcpFeLolCollections } = useLeagueTranslate();
  const { snackError } = useSnackNotification();

  const [rune, setRune] = useState<LolPerksV1Pages>();
  const [perksEdit, setPerkEdit] = useState<PerkEdit>();

  const { rcpFeLolCollectionsTransPerks } = rcpFeLolCollections;

  useEffect(() => {
    makeRequest(
      'GET',
      buildEventUrl('/lol-perks/v1/pages/{digits}', pageRuneId),
      undefined,
    ).then((res) => {
      if (res.ok) {
        setRune(res.body);
      }
    });
  }, [pageRuneId]);

  const handleEditPerk = (value: Partial<PerkEdit>) => {
    if (!perksEdit) return;
    const newValue = {
      ...perksEdit,
      ...value,
    };
    setPerkEdit(newValue);

    makeRequest(
      'PUT',
      buildEventUrl('/lol-perks/v1/pages/{digits}', perksEdit.id),
      {
        isTemporary: rune?.isTemporary ?? true,
        name: newValue.name,
        primaryStyleId: newValue.primaryPerkId,
        subStyleId: newValue.secondaryPerkId,
        selectedPerkIds: [
          ...newValue.primarySlotPerksId,
          ...newValue.secondarySlotPerksId,
          ...newValue.statSlotPerksId,
        ],
      },
    ).then((res) => {
      if (!res.ok) {
        snackError(rcpFeLolCollectionsTransPerks('perks_page_save_failed'));
      }
    });
  };

  useEffect(() => {
    if (!rune) return;
    setPerkEdit({
      id: rune.id,
      name: rune.name,
      isValid: rune.isValid,
      primaryPerkId: rune.primaryStyleId,
      secondaryPerkId: rune.subStyleId,
      primarySlotPerksId: rune.selectedPerkIds.slice(0, 4),
      secondarySlotPerksId: rune.selectedPerkIds.slice(4, 6),
      statSlotPerksId: rune.selectedPerkIds.slice(6, 9),
    });
  }, [rune]);

  if (!perksEdit) return null;

  const bgUrl = genericImg(
    '/plugins/rcp-be-lol-game-data/global/default/content/src/leagueclient/gamemodeassets/ultbook/img/one-page-tutorial-bg.png',
  );

  return (
    <Stack
      direction={'column'}
      p={3}
      height={'100%'}
      width={'100%'}
      rowGap={5}
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bgUrl})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <Stack direction={'row'} columnGap={1} width={'min-content'}>
        {rune?.isTemporary && (
          <Stack direction={'row'} alignItems={'center'}>
            <img
              src={genericImg(
                'plugins/rcp-fe-lol-champ-select/global/default/images/perks/rune-recommender-icon.png',
              )}
              alt={''}
              height={18}
            />
            <Typography>
              {rcpFeLolCollectionsTransPerks(
                'perks_modal_rune_recommender_tab_label_text',
              )}
            </Typography>
          </Stack>
        )}
        <CustomTextField
          debounceTime={200}
          value={perksEdit.name}
          sx={{ width: 300 }}
          onChangeText={(text) =>
            handleEditPerk({
              name: text,
            })
          }
          startIcon={
            !perksEdit.isValid && <FaExclamationTriangle color={'yellow'} />
          }
        />
        <CustomIconButton disabled>
          <FaPlus size={16} />
        </CustomIconButton>
        <CustomIconButton>
          <FaTrash size={16} />
        </CustomIconButton>
      </Stack>
      <Stack
        overflow={'auto'}
        direction={{ xs: 'column', lg: 'row' }}
        justifyContent={{ xs: 'flex-start', lg: 'center' }}
        alignItems={{ xs: 'center', lg: 'start' }}
        gap={4}
        height={'100%'}
        divider={
          <>
            <Divider
              sx={{ display: { xs: 'none', lg: 'block' } }}
              flexItem
              orientation={'vertical'}
            />
            <Divider
              sx={{ display: { xs: 'block', lg: 'none' } }}
              flexItem
              orientation={'horizontal'}
            />
          </>
        }
      >
        <SlotPerks
          type={'primary'}
          handleEditPerk={handleEditPerk}
          perkEdit={perksEdit}
        />
        <SlotPerks
          type={'secondary'}
          handleEditPerk={handleEditPerk}
          perkEdit={perksEdit}
        />
        <SlotPerks
          type={'stat'}
          handleEditPerk={handleEditPerk}
          perkEdit={perksEdit}
        />
      </Stack>
    </Stack>
  );
};
