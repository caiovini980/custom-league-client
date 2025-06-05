import { LolChatV1Friends } from '@shared/typings/lol/response/lolChatV1Friends';
import { PropsWithChildren } from 'react';
import { List, ListItemButton, ListItemText, Tooltip } from '@mui/material';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useStore } from '@render/zustand/store';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';

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

  const lobby = useStore().lobby.lobby();
  const gameFlow = useStore().lobby.gameFlow();
  const currentSummoner = useStore().currentSummoner.info();

  const rcpFeLolSocialTrans = rcpFeLolSocial('trans');

  const disableInviteToGame = () => {
    const conditionsToDisable: boolean[] = [
      friend.availability === 'dnd',
      !lobby,
    ];

    if (lobby) {
      conditionsToDisable.push(!lobby.localMember.allowedInviteOthers);
      conditionsToDisable.push(
        lobby.members.some((m) => m.puuid === friend.puuid),
      );
    }

    return conditionsToDisable.some(Boolean);
  };

  const hiddenOpenParty = () => {
    if (!friend.lol?.pty) return true;
    if (!currentSummoner) return true;
    if (gameFlow?.phase === 'Matchmaking') return true;
    const data = JSON.parse(friend.lol.pty) as LolPartyData;
    return data.summoners.includes(currentSummoner.summonerId);
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
        ).then((res) => {
          console.log(res);
        });
      },
    },
    {
      label: rcpFeLolSocialTrans('context_menu_spectate_game'),
      disabled: friend.lol?.gameStatus !== 'inGame' || !!lobby,
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
  ];

  const ChatMenu = () => {
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
  };

  return (
    <Tooltip title={<ChatMenu />} placement="left" arrow>
      <span>{children}</span>
    </Tooltip>
  );
};
