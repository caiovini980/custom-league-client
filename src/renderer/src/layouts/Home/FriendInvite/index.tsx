import { ButtonBase, Stack, Typography } from '@mui/material';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import {
  FriendRequestModal,
  FriendRequestModalRef,
} from '@render/layouts/Home/FriendInvite/FriendRequestModal';
import { LolChatV2FriendRequests } from '@shared/typings/lol/response/lolChatV2FriendRequests';
import { useRef, useState } from 'react';

export const FriendInvite = () => {
  const { rcpFeLolSocial } = useLeagueTranslate();

  const [friendRequests, setFriendRequest] = useState<
    LolChatV2FriendRequests[]
  >([]);

  const modalRef = useRef<FriendRequestModalRef>(null);

  const { rcpFeLolSocialTrans } = rcpFeLolSocial;

  const { loadEventData } = useLeagueClientEvent(
    '/lol-chat/v2/friend-requests',
    (data) => {
      setFriendRequest(data.filter((d) => d.direction === 'in'));
    },
  );

  useLeagueClientEvent(
    '/lol-chat/v2/friend-requests/{uuid}',
    () => {
      loadEventData();
    },
    {
      showDeleted: true,
    },
  );

  if (!friendRequests.length) return null;

  return (
    <>
      <Stack
        direction={'row'}
        component={ButtonBase}
        onClick={() => modalRef.current?.open()}
        columnGap={2}
        sx={{
          p: 1,
          borderBottom: '1px solid var(--mui-palette-divider)',
          '& > p': {
            color: 'var(--mui-palette-highlight-main)',
          },
        }}
      >
        <Typography>{rcpFeLolSocialTrans('friend_request')}</Typography>
        <Typography>{friendRequests.length}</Typography>
      </Stack>
      <FriendRequestModal
        friendRequests={friendRequests}
        reload={loadEventData}
        ref={modalRef}
      />
    </>
  );
};
