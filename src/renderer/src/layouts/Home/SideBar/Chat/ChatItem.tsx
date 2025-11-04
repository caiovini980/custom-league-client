import { ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { CircularIcon } from '@render/components/CircularIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { ChatItemMenu } from '@render/layouts/Home/SideBar/Chat/ChatItemMenu';
import { getChatAvailabilityColor } from '@render/utils/chat.util';
import { LolChatV1Friends } from '@shared/typings/lol/response/lolChatV1Friends';

interface ChatItemProps {
  chatFriend: LolChatV1Friends;
  onClick: (summonerId: number) => void;
}

export const ChatItem = ({ chatFriend, onClick }: ChatItemProps) => {
  const { profileIcon } = useLeagueImage();
  const { rcpFeLolSocial } = useLeagueTranslate();

  const iconSize = 30;
  const { rcpFeLolSocialTrans } = rcpFeLolSocial;

  const getChatStats = (chat: LolChatV1Friends) => {
    const gameStatus = chat.lol?.gameStatus;
    let stats: string = chat.availability;
    if (gameStatus && gameStatus !== 'outOfGame') {
      stats = gameStatus;
    }
    const statsT = rcpFeLolSocialTrans(`availability_${stats}`);
    if (chat.product !== 'league_of_legends' && chat.productName) {
      return `${statsT} (${chat.productName})`;
    }
    return statsT;
  };

  return (
    <ChatItemMenu friend={chatFriend}>
      <ListItemButton
        onClick={() => onClick(chatFriend.summonerId)}
        sx={{
          p: 1,
          opacity: chatFriend.availability === 'offline' ? 0.4 : 1,
        }}
      >
        <ListItemAvatar
          sx={{
            minWidth: 40,
          }}
        >
          <CircularIcon src={profileIcon(chatFriend.icon)} size={iconSize} />
        </ListItemAvatar>
        <ListItemText
          primary={chatFriend.gameName}
          secondary={getChatStats(chatFriend)}
          slotProps={{
            primary: {
              sx: {
                fontSize: '0.9rem',
              },
            },
            secondary: {
              sx: {
                fontSize: '0.7rem',
                color: getChatAvailabilityColor(chatFriend.availability),
              },
            },
          }}
        />
      </ListItemButton>
    </ChatItemMenu>
  );
};
