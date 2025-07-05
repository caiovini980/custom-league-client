import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import {
  ProfileModal,
  ProfileModalRef,
} from '@render/layouts/Profile/ProfileModal';
import { LolChatV1FriendGroups } from '@shared/typings/lol/response/lolChatV1FriendGroups';
import { sortBy } from 'lodash';
import { Fragment, useRef, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import { ChatItem } from '@render/layouts/Home/Chat/ChatItem';
import { chatStore } from '@render/zustand/stores/chatStore';
import { AddFriendIcon } from '@render/layouts/Home/Chat/AddFriend/AddFriendIcon';
import { SearchFriend } from '@render/layouts/Home/Chat/SearchFriend';

export const Chat = () => {
  const { rcpFeLolSocial } = useLeagueTranslate();

  const profileModal = useRef<ProfileModalRef>(null);

  const { rcpFeLolSocialTrans } = rcpFeLolSocial;

  const chat = chatStore.friends.use();
  const [chatGroups, setChatGroups] = useState<LolChatV1FriendGroups[]>([]);
  const [search, setSearch] = useState('');
  const [groupCollapse, setGroupCollapse] = useState<Record<number, boolean>>(
    {},
  );

  const { loadEventData: loadEventDataFriends } = useLeagueClientEvent(
    '/lol-chat/v1/friends',
    (data) => {
      chatStore.friends.set(data);
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

  useLeagueClientEvent('/lol-chat/v1/friends/{id}', () => {
    loadEventDataFriends();
  });

  useLeagueClientEvent('/lol-chat/v1/friends/{id}', (data) => {
    chatStore.friends.set((chat) =>
      chat.map((c) => {
        if (c.id === data.id) return data;
        return c;
      }),
    );
  });

  const filterChatByGroup = (groupId: number) => {
    const currentChat = chat
      .filter((c) => c.displayGroupId === groupId)
      .filter((c) => {
        if (search) {
          return c.gameName.toLowerCase().includes(search.toLowerCase());
        }
        return true;
      });

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
    <Stack direction={'column'} overflow={'auto'} height={'100%'}>
      <Stack
        direction={'row'}
        columnGap={0.2}
        p={0.5}
        alignItems={'center'}
        position={'relative'}
      >
        <Typography fontSize={'0.7rem'}>
          {rcpFeLolSocialTrans('friend_header')}
        </Typography>
        <Box flexGrow={1} />
        <AddFriendIcon />
        <SearchFriend onSearchChange={setSearch} />
      </Stack>
      <Divider />
      <List sx={{ width: '100%' }} disablePadding>
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
    </Stack>
  );
};
