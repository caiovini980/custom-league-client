import { LolMatchHistoryV1RecentlyPlayedSummoners } from '@shared/typings/lol/response/lolMatchHistoryV1RecentlyPlayedSummoners';
import { orderBy } from 'lodash';
import { parseISO } from 'date-fns';
import { Stack, Typography, Grid } from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { chatStore } from '@render/zustand/stores/chatStore';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { LolChatV2FriendRequests } from '@shared/typings/lol/response/lolChatV2FriendRequests';
import { FriendCardItem } from '@render/layouts/Home/Chat/AddFriend/FriendCardItem';
import { FaUserPlus } from 'react-icons/fa';

interface RecentlyPlayerSummonersProps {
  addPlayer: (gameName: string, tagLine: string) => Promise<boolean>;
  recentlyPlayerSummoners: LolMatchHistoryV1RecentlyPlayedSummoners[];
  friendRequests: LolChatV2FriendRequests[];
}

export const RecentlyPlayerSummoners = ({
  addPlayer,
  recentlyPlayerSummoners,
  friendRequests,
}: RecentlyPlayerSummonersProps) => {
  const { championIcon } = useLeagueImage();
  const { rcpFeLolSocial } = useLeagueTranslate();

  const rcpFeLolSocialTrans = rcpFeLolSocial('trans');

  const recentlyPlayerSummonersFiltered = () => {
    const friends = chatStore.friends.get();
    const friendIds = friends.map((f) => f.puuid);
    const friendRequestIds = friendRequests.map((f) => f.puuid);
    const playerNotFriend = recentlyPlayerSummoners
      .filter((p) => !friendIds.includes(p.puuid))
      .filter((p) => !friendRequestIds.includes(p.puuid));
    return orderBy(
      playerNotFriend,
      (d) => parseISO(d.gameCreationDate),
      'desc',
    );
  };

  return (
    <Stack direction={'column'} rowGap={2}>
      <Typography>
        {rcpFeLolSocialTrans('friend_finder_modal_recently_played_with')}
      </Typography>
      <Grid container spacing={1} overflow={'auto'} maxHeight={400}>
        {recentlyPlayerSummonersFiltered().map((player) => {
          return (
            <Grid key={player.puuid} size={{ xs: 12, sm: 6, md: 4 }}>
              <FriendCardItem
                summonerId={player.summonerId}
                gameName={player.gameName}
                tagLine={player.tagLine}
                iconSrc={championIcon(player.championId)}
                iconAction={<FaUserPlus size={16} />}
                onClickAction={() => addPlayer(player.gameName, player.tagLine)}
              />
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
};
