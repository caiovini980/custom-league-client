import { LolChatV1Friends } from '@shared/typings/lol/response/lolChatV1Friends';
import { PropsWithChildren } from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useStore } from '@render/zustand/store';

interface ChatItemMenuProps {
  friend: LolChatV1Friends;
}

export const ChatItemMenu = ({
  friend,
  children,
}: PropsWithChildren<ChatItemMenuProps>) => {
  const { genericImg } = useLeagueImage();
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolSocial } = useLeagueTranslate();

  const lobby = useStore().lobby.lobby();

  const rcpFeLolSocialTrans = rcpFeLolSocial('trans');

  const menus = [
    {
      label: rcpFeLolSocialTrans('context_menu_spectate_game'),
      disabled: friend.lol?.gameStatus !== 'inGame' || !!lobby,
      iconPath: '',
      onClick: () => {
        makeRequest('POST', '/lol-spectator/v1/spectate/launch', {
          puuid: friend.puuid,
        });
      },
    },
    {
      label: rcpFeLolSocialTrans('context_menu_invite_to_game'),
      disabled:
        friend.availability !== 'chat' ||
        !lobby?.localMember.allowedInviteOthers,
      iconPath: '/plugins/rcp-fe-lol-social/global/default/add_person_mask.png',
      onClick: () => {
        makeRequest('POST', '/lol-lobby/v2/lobby/invitations', [
          {
            toSummonerId: friend.summonerId,
            invitationType: 'lobby',
          },
        ]);
      },
    },
  ];

  const ChatMenu = () => {
    return (
      <List dense sx={{ p: 0 }}>
        {menus.map((m) => {
          return (
            <ListItemButton
              key={m.label}
              disabled={m.disabled}
              onClick={m.onClick}
            >
              <ListItemIcon
                sx={{
                  minWidth: 30,
                }}
              >
                {m.iconPath && (
                  <img src={genericImg(m.iconPath)} alt="" width={20} />
                )}
              </ListItemIcon>
              <ListItemText>{m.label}</ListItemText>
            </ListItemButton>
          );
        })}
      </List>
    );
  };

  return (
    <Tooltip title={<ChatMenu />} placement="left" arrow>
      <span>{children}</span>
    </Tooltip>
  );
};
