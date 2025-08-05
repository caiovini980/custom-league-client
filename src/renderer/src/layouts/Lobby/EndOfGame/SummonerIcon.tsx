import { Menu, MenuItem } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import { CustomIconButton } from '@render/components/input';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useSnackNotification } from '@render/hooks/useSnackNotification';
import { ReportModal, ReportModalRef } from '@render/layouts/Lobby/ReportModal';
import {
  ProfileModal,
  ProfileModalRef,
} from '@render/layouts/Profile/ProfileModal';
import { currentSummonerStore } from '@render/zustand/stores/currentSummonerStore';
import { MouseEvent, useRef, useState } from 'react';

interface SummonerIconProps {
  puuid: string;
  summonerId: number;
  profileIconId: number;
  gameId: number;
}

export const SummonerIcon = ({
  puuid,
  summonerId,
  profileIconId,
  gameId,
}: SummonerIconProps) => {
  const { makeRequest } = useLeagueClientRequest();
  const { profileIcon } = useLeagueImage();
  const { rcpFeLolPostgame, rcpFeLolSocial } = useLeagueTranslate();
  const { snackSuccess, snackError } = useSnackNotification();

  const { rcpFeLolPostgameTrans } = rcpFeLolPostgame;
  const { rcpFeLolSocialTrans } = rcpFeLolSocial;

  const currentSummonerId = currentSummonerStore.info.use(
    (s) => s?.summonerId ?? 0,
  );

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const profileRef = useRef<ProfileModalRef>(null);
  const reportModalRef = useRef<ReportModalRef>(null);

  const handleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(ev.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickAddFriend = () => {
    makeRequest('POST', '/lol-chat/v2/friend-requests', {
      puuid: puuid,
    }).then((res) => {
      if (res.ok) {
        snackSuccess(rcpFeLolSocialTrans('friend_request_sent_details'));
      } else {
        snackError(rcpFeLolPostgameTrans('postgame_friend_request_error'));
      }
    });
  };

  return (
    <>
      <CustomIconButton
        onClick={handleClick}
        disabled={currentSummonerId === summonerId}
        sx={{
          p: 0.5,
        }}
      >
        <CircularIcon src={profileIcon(profileIconId)} size={30} />
      </CustomIconButton>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            onClickAddFriend();
          }}
        >
          {rcpFeLolPostgameTrans('postgame_context_menu_add_friend')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            profileRef.current?.open(summonerId);
          }}
        >
          {rcpFeLolPostgameTrans('postgame_context_menu_view_profile')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            reportModalRef.current?.open(puuid, gameId);
          }}
        >
          {rcpFeLolPostgameTrans('postgame_context_menu_report')}
        </MenuItem>
      </Menu>
      <ProfileModal ref={profileRef} />
      <ReportModal type={'end-of-game-reports'} ref={reportModalRef} />
    </>
  );
};
