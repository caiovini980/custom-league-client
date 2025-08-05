import { Stack, Typography } from '@mui/material';
import { CustomIconButton, CustomSelect } from '@render/components/input';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { RecommendedPerks } from '@render/layouts/Lobby/ChampSelect/CenterArea/Runes/RecommendedPerks';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { LolPerksV1Pages } from '@shared/typings/lol/response/lolPerksV1Pages';
import { useEffect, useRef, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaShuffle } from 'react-icons/fa6';
import {
  RuneEditModal,
  RuneEditModalRef,
} from '@render/layouts/Lobby/ChampSelect/CenterArea/Runes/RuneEditModal';

export const Runes = () => {
  const { genericImg } = useLeagueImage();
  const { makeRequest } = useLeagueClientRequest();
  const championId = champSelectStore.getCurrentSummonerData(
    (s) => s.championId,
    0,
  );
  const assignedPosition = champSelectStore.getCurrentSummonerData(
    (s) => s.assignedPosition,
    'NONE',
  );
  const mapId = lobbyStore.lobby.use((s) => s?.gameConfig.mapId ?? 0);

  const runeEditModalRef = useRef<RuneEditModalRef>(null);

  const [runesPage, setRunesPage] = useState<LolPerksV1Pages[]>([]);
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
        disabled={!championId}
      >
        <FaShuffle size={12} />
      </CustomIconButton>
      <CustomIconButton
        size={'small'}
        onClick={() => runeEditModalRef.current?.open(currentPageId)}
      >
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
      <RuneEditModal ref={runeEditModalRef} />
      <RecommendedPerks
        open={openRecommendedPerkModal}
        onSelectPerk={(id) => runeEditModalRef.current?.open(id)}
        onClose={() => setOpenRecommendedPerkModal(false)}
        position={assignedPosition}
        championId={championId}
        mapId={mapId}
      />
    </Stack>
  );
};
