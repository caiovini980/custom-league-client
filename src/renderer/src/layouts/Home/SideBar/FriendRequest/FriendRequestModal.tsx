import { Box, Stack, Typography } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import CustomDialog, {
  CustomDialogCloseFloatingButton,
} from '@render/components/CustomDialog';
import { CustomIconButton } from '@render/components/input';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import {
  ProfileModal,
  ProfileModalRef,
} from '@render/layouts/Profile/ProfileModal';
import { LolChatV2FriendRequests } from '@shared/typings/lol/response/lolChatV2FriendRequests';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { FaBan, FaCheck } from 'react-icons/fa6';
import { MdClose } from 'react-icons/md';

interface FriendRequestModalProps {
  reload: () => void;
  friendRequests: LolChatV2FriendRequests[];
}

export interface FriendRequestModalRef {
  open: () => void;
}

export const FriendRequestModal = forwardRef<
  FriendRequestModalRef,
  FriendRequestModalProps
>((props, ref) => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolSocial } = useLeagueTranslate();
  const { profileIcon } = useLeagueImage();

  const profileModalRef = useRef<ProfileModalRef>(null);

  const [openModal, setOpenModal] = useState(false);

  const iconSize = 14;
  const { rcpFeLolSocialTrans } = rcpFeLolSocial;

  useImperativeHandle(ref, () => {
    return {
      open: () => setOpenModal(true),
    };
  }, []);

  const onClickBlock = (id: string) => {
    onClickDeny(id);
    makeRequest('POST', '/lol-chat/v1/blocked-players', {
      puuid: id,
    }).then((res) => {
      if (res.ok) {
        props.reload();
      }
    });
  };

  const onClickAccepted = (id: string) => {
    makeRequest('POST', '/lol-chat/v2/friend-requests', {
      puuid: id,
    }).then((res) => {
      if (res.ok) {
        props.reload();
      }
    });
  };

  const onClickDeny = (id: string) => {
    makeRequest(
      'DELETE',
      buildEventUrl('/lol-chat/v2/friend-requests/{uuid}', id),
      undefined,
    ).then((res) => {
      if (res.ok) {
        props.reload();
      }
    });
  };

  return (
    <>
      <CustomDialog
        open={openModal}
        actionsComponent={<div />}
        maxWidth={'sm'}
        fullWidth
        title={rcpFeLolSocialTrans('friend_request')}
      >
        <CustomDialogCloseFloatingButton
          handleClose={() => setOpenModal(false)}
        />
        <Stack direction={'column'} width={'100%'} rowGap={2} pt={3}>
          {props.friendRequests.map((f) => {
            return (
              <Stack
                key={f.puuid}
                direction={'row'}
                columnGap={2}
                alignItems={'center'}
              >
                <CustomIconButton
                  onClick={() =>
                    profileModalRef.current?.openWithGameNameAndTag(
                      f.gameName,
                      f.tagLine,
                    )
                  }
                >
                  <CircularIcon src={profileIcon(f.icon)} />
                </CustomIconButton>
                <Typography>
                  {f.gameName} #{f.tagLine}
                </Typography>
                <Box flexGrow={1} />
                <CustomIconButton onClick={() => onClickAccepted(f.puuid)}>
                  <FaCheck size={iconSize} />
                </CustomIconButton>
                <CustomIconButton onClick={() => onClickDeny(f.puuid)}>
                  <MdClose size={iconSize} />
                </CustomIconButton>
                <CustomIconButton
                  onClick={() => onClickBlock(f.puuid)}
                  sx={{ display: 'none' }}
                >
                  <FaBan size={iconSize} />
                </CustomIconButton>
              </Stack>
            );
          })}
        </Stack>
      </CustomDialog>
      <ProfileModal ref={profileModalRef} />
    </>
  );
});
