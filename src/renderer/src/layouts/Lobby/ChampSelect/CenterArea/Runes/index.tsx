import { Stack, Typography } from '@mui/material';
import CustomDialog, {
  CustomDialogCloseFloatingButton,
} from '@render/components/CustomDialog';
import { CustomIconButton, CustomSelect } from '@render/components/input';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { RecommendedPerks } from '@render/layouts/Lobby/ChampSelect/CenterArea/Runes/RecommendedPerks';
import { RuneEdit } from '@render/layouts/Lobby/ChampSelect/CenterArea/Runes/RuneEdit';
import { useChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { LolPerksV1Pages } from '@shared/typings/lol/response/lolPerksV1Pages';
import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaShuffle } from 'react-icons/fa6';

export const Runes = () => {
  const { genericImg } = useLeagueImage();
  const { makeRequest } = useLeagueClientRequest();
  const { currentPlayer } = useChampSelectContext();
  const lobby = lobbyStore.lobby.use();

  const [runesPage, setRunesPage] = useState<LolPerksV1Pages[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openRecommendedPerkModal, setOpenRecommendedPerkModal] =
    useState(false);
  const [currentPageId, setCurrentPageId] = useState(0);

  useLeagueClientEvent('/lol-perks/v1/pages', (data) => {
    setRunesPage(data);
  });

  useLeagueClientEvent('/lol-perks/v1/currentpage', (data) => {
    setCurrentPageId(data.id);
  });

  const onChangePage = (pageId: number) => {
    makeRequest('PUT', '/lol-perks/v1/currentpage', pageId).then();
  };

  useEffect(() => {
    if (currentPageId === 0 && runesPage.length) {
      makeRequest('PUT', '/lol-perks/v1/currentpage', runesPage[0].id).then();
    }
  }, [currentPageId]);

  return (
    <Stack className={'theme-dark'} direction={'row'} columnGap={1}>
      <CustomIconButton
        size={'small'}
        onClick={() => setOpenRecommendedPerkModal(true)}
        disabled={
          !(currentPlayer.championId || currentPlayer.championPickIntent)
        }
      >
        <FaShuffle size={12} />
      </CustomIconButton>
      <CustomIconButton size={'small'} onClick={() => setOpenModal(true)}>
        <FaEdit size={12} />
      </CustomIconButton>
      <CustomSelect
        label={''}
        fullWidth
        sx={{
          width: 320,
        }}
        size={'small'}
        value={currentPageId}
        onChangeValue={onChangePage}
        options={runesPage.map((r) => ({
          value: r.id,
          label: r.isTemporary ? (
            <Stack direction={'row'} columnGap={1} alignItems={'center'}>
              <img
                src={genericImg(
                  'plugins/rcp-fe-lol-champ-select/global/default/images/perks/rune-recommender-icon.png',
                )}
                alt={''}
                height={18}
              />
              <Typography>{r.name}</Typography>
            </Stack>
          ) : (
            r.name
          ),
        }))}
      />
      <CustomDialog
        open={openModal}
        fullWidth
        maxWidth={'md'}
        hiddenBtnConfirm
        className={'theme-dark'}
        dialogContentProps={{
          sx: {
            p: 0,
            position: 'relative',
            height: '80vh',
          },
        }}
        actionsComponent={<div />}
      >
        <CustomDialogCloseFloatingButton
          handleClose={() => setOpenModal(false)}
        />
        <RuneEdit />
      </CustomDialog>
      <RecommendedPerks
        open={openRecommendedPerkModal}
        onSelectPerk={() => setOpenModal(true)}
        perkToChangeId={runesPage.find((r) => r.isTemporary)?.id}
        onClose={() => setOpenRecommendedPerkModal(false)}
        position={currentPlayer.assignedPosition || 'middle'}
        championId={
          currentPlayer.championPickIntent || currentPlayer.championId
        }
        mapId={lobby?.gameConfig.mapId ?? 0}
      />
    </Stack>
  );
};
