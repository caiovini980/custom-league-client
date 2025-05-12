import { ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { LolChatV1Friends } from '@shared/typings/lol/response/lolChatV1Friends';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { ChatItemMenu } from '@render/layouts/Home/Chat/ChatItemMenu';
import { CircularIcon } from '@render/components/CircularIcon';

interface ChatItemProps {
  chatFriend: LolChatV1Friends;
  onClick: (summonerId: number) => void;
}

export const ChatItem = ({ chatFriend, onClick }: ChatItemProps) => {
  const { profileIcon } = useLeagueImage();
  const { rcpFeLolSocial } = useLeagueTranslate();

  const iconSize = 30;
  const rcpFeLolSocialTrans = rcpFeLolSocial('trans');

  const getColor = (availability: string) => {
    if (availability === 'chat') {
      return '#71ff89';
    }
    if (availability === 'away') {
      return '#ff6464';
    }
    if (availability === 'dnd') {
      return '#61a5ff';
    }
    return undefined;
  };

  const getChatStats = (chat: LolChatV1Friends) => {
    const gameStatus = chat.lol?.gameStatus;
    let stats: string = chat.availability;
    if (gameStatus && gameStatus !== 'outOfGame') {
      stats = gameStatus;
    }
    const statsT = rcpFeLolSocialTrans(`availability_${stats}`);
    if (chat.productName) {
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
                color: getColor(chatFriend.availability),
              },
            },
          }}
        />
      </ListItemButton>
    </ChatItemMenu>
  );
};
