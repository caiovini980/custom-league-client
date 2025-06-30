import { ButtonBase, Stack, Typography } from '@mui/material';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useRef, useState } from 'react';
import { LolChatV2FriendRequests } from '@shared/typings/lol/response/lolChatV2FriendRequests';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import {
  FriendRequestModal,
  FriendRequestModalRef,
} from '@render/layouts/Home/FriendInvite/FriendRequestModal';

export const FriendInvite = () => {
  const { rcpFeLolSocial } = useLeagueTranslate();

  const [friendRequests, setFriendRequest] = useState<
    LolChatV2FriendRequests[]
  >([]);

  const modalRef = useRef<FriendRequestModalRef>(null);

  const rcpFeLolSocialTrans = rcpFeLolSocial('trans');

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
            color: 'var(--mui-palette-highlight)',
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
