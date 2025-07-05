import CustomDialog, {
  CustomDialogCloseFloatingButton,
} from '@render/components/CustomDialog';
import { useEffect, useState } from 'react';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { Stack } from '@mui/material';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useSnackNotification } from '@render/hooks/useSnackNotification';
import { LolMatchHistoryV1RecentlyPlayedSummoners } from '@shared/typings/lol/response/lolMatchHistoryV1RecentlyPlayedSummoners';
import { LolChatV2FriendRequests } from '@shared/typings/lol/response/lolChatV2FriendRequests';
import { AddFriendForm } from '@render/layouts/Home/Chat/AddFriend/AddFriendForm';
import { FriendRequestSent } from '@render/layouts/Home/Chat/AddFriend/FriendRequestSent';
import { RecentlyPlayerSummoners } from '@render/layouts/Home/Chat/AddFriend/RecentlyPlayerSummoners';

interface AddFriendModalProps {
  openModal: boolean;
  onCloseModal: () => void;
}

export const AddFriendModal = ({
  openModal,
  onCloseModal,
}: AddFriendModalProps) => {
  const { makeRequest } = useLeagueClientRequest();

  const { snackSuccess, snackError } = useSnackNotification();
  const { rcpFeLolSocial, rcpFeLolPostgame } = useLeagueTranslate();

  const [recentlyPlayerSummoners, setRecentlyPlayerSummoners] = useState<
    LolMatchHistoryV1RecentlyPlayedSummoners[]
  >([]);
  const [friendRequests, setFriendRequest] = useState<
    LolChatV2FriendRequests[]
  >([]);

  const { rcpFeLolSocialTrans } = rcpFeLolSocial;
  const { rcpFeLolPostgameTrans } = rcpFeLolPostgame;

  const addPlayer = async (gameName: string, tagLine: string) => {
    const error = () => {
      snackError(rcpFeLolPostgameTrans('postgame_friend_request_error'));
    };

    const lookupPlayer = await makeRequest(
      'GET',
      buildEventUrl(
        '/lol-summoner/v1/alias/lookup?gameName={string}&tagLine={string}',
        encodeURIComponent(gameName),
        tagLine,
      ),
      undefined,
    );

    if (!lookupPlayer.ok) {
      error();
      return false;
    }
    const request = await makeRequest('POST', '/lol-chat/v2/friend-requests', {
      puuid: lookupPlayer.body.puuid,
    });
    if (request.ok) {
      snackSuccess(rcpFeLolSocialTrans('friend_request_sent_details'));
      loadFriendRequest();
      loadRecentlyPlayed();
      return true;
    }
    error();
    return false;
  };

  const loadFriendRequest = () => {
    makeRequest('GET', '/lol-chat/v2/friend-requests', undefined).then(
      (res) => {
        if (res.ok) {
          setFriendRequest(res.body.filter((d) => d.direction === 'out'));
        }
      },
    );
  };

  const loadRecentlyPlayed = () => {
    makeRequest(
      'GET',
      '/lol-match-history/v1/recently-played-summoners',
      undefined,
    ).then((res) => {
      if (res.ok) {
        setRecentlyPlayerSummoners(res.body);
      }
    });
  };

  useEffect(() => {
    if (!openModal) return;
    loadRecentlyPlayed();
    loadFriendRequest();
  }, [openModal]);

  return (
    <CustomDialog
      title={rcpFeLolSocialTrans('friend_finder_modal_title')}
      maxWidth={'md'}
      fullWidth
      open={openModal}
      actionsComponent={<div />}
    >
      <CustomDialogCloseFloatingButton handleClose={onCloseModal} />
      <Stack direction={'column'} rowGap={2} width={'100%'} overflow={'auto'}>
        <AddFriendForm addFriend={addPlayer} />
        <FriendRequestSent
          friendRequests={friendRequests}
          loadFriendRequest={loadFriendRequest}
        />
        <RecentlyPlayerSummoners
          recentlyPlayerSummoners={recentlyPlayerSummoners}
          friendRequests={friendRequests}
          addPlayer={addPlayer}
        />
      </Stack>
    </CustomDialog>
  );
};
