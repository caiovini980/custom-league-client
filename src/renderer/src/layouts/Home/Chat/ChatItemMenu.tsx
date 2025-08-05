import { List, ListItemButton, ListItemText, Tooltip } from '@mui/material';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { LolChatV1Friends } from '@shared/typings/lol/response/lolChatV1Friends';
import { PropsWithChildren, useMemo } from 'react';

interface LolPartyData {
  summoners: number[];
  queueId: number;
  partyId: string;
  maxPlayers: number;
}

interface ChatItemMenuProps {
  friend: LolChatV1Friends;
}

export const ChatItemMenu = ({
  friend,
  children,
}: PropsWithChildren<ChatItemMenuProps>) => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolSocial } = useLeagueTranslate();

  const partyId = lobbyStore.lobby.use((s) => s?.partyId ?? -1);
  const hasLobby = lobbyStore.lobby.use((s) => !!s);
  const allowedInviteOthers = lobbyStore.lobby.use(
    (s) => s?.localMember.allowedInviteOthers ?? false,
  );
  const isFriendInGroup = lobbyStore.lobby.use(
    (s) => s?.members.some((m) => m.puuid === friend.puuid) ?? false,
  );
  const gameFlowPhase = lobbyStore.gameFlow.use((s) => s?.phase ?? 'None');

  const { rcpFeLolSocialTrans } = rcpFeLolSocial;

  const disableInviteToGame = () => {
    const conditionsToDisable: boolean[] = [
      friend.availability === 'dnd',
      !hasLobby,
    ];

    conditionsToDisable.push(!allowedInviteOthers);
    conditionsToDisable.push(isFriendInGroup);
    conditionsToDisable.push(friend.product !== 'league_of_legends');

    return conditionsToDisable.some(Boolean);
  };

  const hiddenOpenParty = () => {
    if (!friend.lol?.pty) return true;
    if (gameFlowPhase === 'Matchmaking') return true;
    const data = JSON.parse(friend.lol.pty) as LolPartyData;
    return data.partyId === partyId;
  };

  const getPartyId = () => {
    if (!friend.lol?.pty) return '';
    const data = JSON.parse(friend.lol.pty) as LolPartyData;
    return data.partyId;
  };

  const menus = [
    {
      label: rcpFeLolSocialTrans('roster_open_party_join_button'),
      disabled: false,
      hidden: hiddenOpenParty(),
      onClick: () => {
        makeRequest(
          'POST',
          buildEventUrl('/lol-lobby/v2/party/{uuid}/join', getPartyId()),
          undefined,
        ).then();
      },
    },
    {
      label: rcpFeLolSocialTrans('context_menu_send_message'),
      onClick: () => {
        makeRequest('POST', '/lol-chat/v1/conversations', {
          id: friend.id,
          type: 'chat',
        }).then((res) => {
          if (res.ok) {
            makeRequest('PUT', '/lol-chat/v1/conversations/active', {
              id: friend.id,
            });
          }
        });
      },
    },
    {
      label: rcpFeLolSocialTrans('context_menu_spectate_game'),
      disabled: friend.lol?.gameStatus !== 'inGame' || hasLobby,
      onClick: () => {
        makeRequest('POST', '/lol-spectator/v1/spectate/launch', {
          puuid: friend.puuid,
        });
      },
    },
    {
      label: rcpFeLolSocialTrans('context_menu_invite_to_game'),
      disabled: disableInviteToGame(),
      onClick: () => {
        makeRequest('POST', '/lol-lobby/v2/lobby/invitations', [
          {
            toSummonerId: friend.summonerId,
            invitationType: 'lobby',
          },
        ]);
      },
    },
    {
      label: rcpFeLolSocialTrans('context_menu_unfriend'),
      onClick: () => {
        makeRequest(
          'DELETE',
          buildEventUrl('/lol-chat/v1/friends/{id}', friend.id),
          undefined,
        );
      },
    },
  ];

  const chatMenu = useMemo(() => {
    return (
      <List dense sx={{ p: 0 }}>
        {menus
          .filter((m) => !m.hidden)
          .map((m) => {
            return (
              <ListItemButton
                key={m.label}
                disabled={m.disabled}
                onClick={m.onClick}
              >
                <ListItemText>{m.label}</ListItemText>
              </ListItemButton>
            );
          })}
      </List>
    );
  }, [menus]);

  return (
    <Tooltip title={chatMenu} placement="left" arrow>
      <span>{children}</span>
    </Tooltip>
  );
};
