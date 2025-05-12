import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import {
  ProfileModal,
  ProfileModalRef,
} from '@render/layouts/Profile/ProfileModal';
import { LolChatV1FriendGroups } from '@shared/typings/lol/response/lolChatV1FriendGroups';
import { LolChatV1Friends } from '@shared/typings/lol/response/lolChatV1Friends';
import { sortBy } from 'lodash';
import { Fragment, useRef, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import { ChatItem } from '@render/layouts/Home/Chat/ChatItem';

export const Chat = () => {
  const { rcpFeLolSocial } = useLeagueTranslate();

  const profileModal = useRef<ProfileModalRef>(null);

  const rcpFeLolSocialTrans = rcpFeLolSocial('trans');

  const [chat, setChat] = useState<LolChatV1Friends[]>([]);
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
    (data) => {
      setChatGroups(sortBy(data, (d) => -1 * d.priority));
      const gc = data.reduce((prev, curr) => {
        return Object.assign(prev, {
          [curr.id]: groupCollapse[curr.id] ?? false,
        });
      }, {});
      setGroupCollapse(gc);
    },
    {
      deps: [Object.keys(groupCollapse).length],
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

  return (
    <Box display={'flex'} overflow={'auto'}>
      <List sx={{ width: '100%' }}>
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
                  <ChatItem
                    key={c.id}
                    chatFriend={c}
                    onClick={(summonerId) =>
                      profileModal.current?.open(summonerId)
                    }
                  />
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
