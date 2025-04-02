import {
  Avatar,
  Collapse,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
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
  const { profileIcon } = useLeagueImage();

  const profileModal = useRef<ProfileModalRef>(null);

  const [chat, setChat] = useState<lolChatV1Friends[]>([]);
  const [chatGroups, setChatGroups] = useState<LolChatV1FriendGroups[]>([]);
  const [groupCollapse, setGroupCollapse] = useState<Record<number, boolean>>(
    {},
  );

  useLeagueClientEvent('/lol-chat/v1/friends', (data) => {
    setChat(data);
  });

  useLeagueClientEvent('/lol-chat/v1/friend-groups', (data) => {
    setChatGroups(sortBy(data, (d) => -1 * d.priority));
    const gc = data.reduce((prev, curr) => {
      return Object.assign(prev, {
        [curr.id]: false,
      });
    }, {});
    setGroupCollapse(gc);
  });

  const filterChatByGroup = (groupId: number) => {
    return chat.filter((c) => c.displayGroupId === groupId);
  };

  const onClickGroup = (groupId: number) => {
    setGroupCollapse((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const groupNameParse = (groupName: string) => {
    const nameMap = {
      '**Default': 'General',
      OFFLINE: 'Offline',
    };
    return nameMap[groupName] ?? groupName;
  };

  return (
    <>
      <List sx={{ overflow: 'auto' }}>
        {chatGroups.map((cg) => (
          <Fragment key={cg.id}>
            <ListItemButton onClick={() => onClickGroup(cg.id)}>
              <ListItemText
                primary={`${groupNameParse(cg.name)} (${filterChatByGroup(cg.id).length})`}
              />
              {groupCollapse[cg.id] ? <FaAngleUp /> : <FaAngleDown />}
            </ListItemButton>
            <Collapse in={groupCollapse[cg.id]}>
              <List sx={{ overflow: 'auto' }}>
                {filterChatByGroup(cg.id).map((c) => (
                  <ListItemButton
                    key={c.id}
                    onClick={() => profileModal.current?.open(c.summonerId)}
                  >
                    <ListItemAvatar>
                      <Avatar src={profileIcon(c.icon)} />
                    </ListItemAvatar>
                    <ListItemText primary={c.gameName} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </Fragment>
        ))}
      </List>
      <ProfileModal ref={profileModal} />
    </>
  );
};
