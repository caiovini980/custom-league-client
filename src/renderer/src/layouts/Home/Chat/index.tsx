import {
  Avatar,
  Box,
  Collapse,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import {
  ProfileModal,
  ProfileModalRef,
} from '@render/layouts/Profile/ProfileModal';
import { LolChatV1FriendGroups } from '@shared/typings/lol/response/lolChatV1FriendGroups';
import { lolChatV1Friends } from '@shared/typings/lol/response/lolChatV1Friends';
import { sortBy } from 'lodash';
import { Fragment, useRef, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';

export const Chat = () => {
  const { profileIcon, genericImg } = useLeagueImage();
  const { rcpFeLolSocial } = useLeagueTranslate();
  const { makeRequest } = useLeagueClientRequest();

  const profileModal = useRef<ProfileModalRef>(null);

  const iconSize = 40;
  const rcpFeLolSocialTrans = rcpFeLolSocial('trans');

  const [chat, setChat] = useState<lolChatV1Friends[]>([]);
  const [chatGroups, setChatGroups] = useState<LolChatV1FriendGroups[]>([]);
  const [groupCollapse, setGroupCollapse] = useState<Record<number, boolean>>(
    {},
  );

  const { loadEventData: loadEventDataFriends } = useLeagueClientEvent(
    '/lol-chat/v1/friends',
    (data) => {
      setChat(data);
    },
  );

  const { loadEventData: loadEventDataFriendGroups } = useLeagueClientEvent(
    '/lol-chat/v1/friend-groups',
    // QUESTION: is this supposed to do something?
    (data) => {
      setChatGroups(sortBy(data, (d) => -1 * d.priority));
      const gc = data.reduce((prev, curr) => {
        return Object.assign(prev, {
          [curr.id]: false,
        });
      }, {});
      setGroupCollapse(gc);
    },
  );

  useLeagueClientEvent('/lol-chat/v1/friend-groups/{digits}', () => {
    loadEventDataFriendGroups();
  });

  useLeagueClientEvent('/lol-chat/v1/friend-counts', () => {
    loadEventDataFriends();
  });

  const filterChatByGroup = (groupId: number) => {
    const currentChat = chat.filter((c) => c.displayGroupId === groupId);

    return sortBy(currentChat, (each) => {
      return each.availability;
    });
  };

  const onClickGroup = (groupId: number) => {
    setGroupCollapse((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const groupNameParse = (groupName: string) => {
    const nameMap = {
      '**Default': rcpFeLolSocialTrans('group_label_default'),
      OFFLINE: rcpFeLolSocialTrans('group_label_offline'),
    };
    return nameMap[groupName] ?? groupName;
  };

  const inviteTooltip = (friend: lolChatV1Friends) => {
    if (friend.availability !== 'chat') {
      return '';
    }

    return (
      <IconButton
        onClick={() => {
          makeRequest('POST', '/lol-lobby/v2/lobby/invitations', [
            {
              toSummonerId: friend.summonerId,
              invitationType: 'lobby',
            },
          ]);
        }}
      >
        <img
          src={genericImg(
            '/plugins/rcp-fe-lol-social/global/default/add_person_mask.png',
          )}
          alt=""
          width={20}
        />
      </IconButton>
    );
  };

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

  const getChatStats = (chat: lolChatV1Friends) => {
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
    <Box display={'flex'} overflow={'auto'}>
      <List>
        {chatGroups.map((cg) => (
          <Fragment key={cg.id}>
            <ListItemButton onClick={() => onClickGroup(cg.id)}>
              <ListItemText
                primary={`${groupNameParse(cg.name)} (${filterChatByGroup(cg.id).length})`}
              />
              {groupCollapse[cg.id] ? <FaAngleUp /> : <FaAngleDown />}
            </ListItemButton>
            <Collapse in={groupCollapse[cg.id]}>
              <List sx={{ width: '100%', flexShrink: 0 }}>
                {filterChatByGroup(cg.id).map((c) => (
                  <Tooltip title={inviteTooltip(c)} key={c.id} placement="left">
                    <ListItemButton
                      onClick={() => profileModal.current?.open(c.summonerId)}
                      sx={{
                        opacity: c.availability === 'offline' ? 0.4 : 1,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={profileIcon(c.icon)}
                          sx={{ width: iconSize, height: iconSize }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={c.gameName}
                        secondary={getChatStats(c)}
                        slotProps={{
                          secondary: {
                            sx: {
                              color: getColor(c.availability),
                            },
                          },
                        }}
                      />
                    </ListItemButton>
                  </Tooltip>
                ))}
              </List>
            </Collapse>
          </Fragment>
        ))}
      </List>
      <ProfileModal ref={profileModal} />
    </Box>
  );
};
