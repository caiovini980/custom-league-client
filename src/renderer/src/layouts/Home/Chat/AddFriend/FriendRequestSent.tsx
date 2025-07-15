import { Grid, Stack, Typography } from '@mui/material';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { FriendCardItem } from '@render/layouts/Home/Chat/AddFriend/FriendCardItem';
import { LolChatV2FriendRequests } from '@shared/typings/lol/response/lolChatV2FriendRequests';
import { FaX } from 'react-icons/fa6';

interface FriendRequestSentProps {
  friendRequests: LolChatV2FriendRequests[];
  loadFriendRequest: () => void;
}

export const FriendRequestSent = ({
  friendRequests,
  loadFriendRequest,
}: FriendRequestSentProps) => {
  const { profileIcon } = useLeagueImage();
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolSocial } = useLeagueTranslate();

  const { rcpFeLolSocialTrans } = rcpFeLolSocial;

  const onClickRemoveFriendRequest = (id: string) => {
    makeRequest(
      'DELETE',
      buildEventUrl('/lol-chat/v2/friend-requests/{uuid}', id),
      undefined,
    ).then((res) => {
      if (res.ok) {
        setTimeout(() => {
          loadFriendRequest();
        }, 500);
      }
    });
  };

  if (!friendRequests.length) return null;

  return (
    <Stack direction={'column'} rowGap={2}>
      <Typography>
        {rcpFeLolSocialTrans('friend_finder_modal_requested_summoners')}
      </Typography>
      <Grid container spacing={1} overflow={'auto'} maxHeight={400}>
        {friendRequests.map((player) => {
          return (
            <Grid key={player.puuid} size={{ xs: 12, sm: 6, md: 4 }}>
              <FriendCardItem
                summonerId={player.summonerId}
                gameName={player.gameName}
                tagLine={player.tagLine}
                iconSrc={profileIcon(player.icon)}
                iconAction={<FaX size={12} />}
                onClickAction={() => onClickRemoveFriendRequest(player.puuid)}
              />
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
};
