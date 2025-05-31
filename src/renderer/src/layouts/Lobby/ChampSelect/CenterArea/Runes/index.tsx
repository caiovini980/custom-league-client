import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useState } from 'react';
import { LolPerksV1Pages } from '@shared/typings/lol/response/lolPerksV1Pages';
import { CustomIconButton, CustomSelect } from '@render/components/input';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { Stack } from '@mui/material';
import { FaEdit, FaTimes } from 'react-icons/fa';
import CustomDialog from '@render/components/CustomDialog';
import { RuneEdit } from '@render/layouts/Lobby/ChampSelect/CenterArea/Runes/RuneEdit';

export const Runes = () => {
  const { makeRequest } = useLeagueClientRequest();

  const [runesPage, setRunesPage] = useState<LolPerksV1Pages[]>([]);
  const [openModal, setOpenModal] = useState(false);
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

  return (
    <Stack direction={'row'} columnGap={1}>
      <CustomIconButton size={'small'} onClick={() => setOpenModal(true)}>
        <FaEdit size={12} />
      </CustomIconButton>
      <CustomSelect
        label={''}
        fullWidth
        sx={{
          width: 220,
        }}
        size={'small'}
        value={currentPageId}
        onChangeValue={onChangePage}
        options={runesPage.map((r) => ({
          value: r.id,
          label: r.name,
        }))}
      />
      <CustomDialog
        open={openModal}
        fullWidth
        maxWidth={'md'}
        hiddenBtnConfirm
        dialogContentProps={{
          sx: {
            p: 0,
            position: 'relative',
            height: '80vh',
          },
        }}
        actionsComponent={<div />}
      >
        <CustomIconButton
          onClick={() => setOpenModal(false)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <FaTimes size={20} />
        </CustomIconButton>
        <RuneEdit />
      </CustomDialog>
    </Stack>
  );
};
