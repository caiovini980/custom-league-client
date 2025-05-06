import { Button /*Typography*/ } from '@mui/material';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useSnackNotification } from '@render/hooks/useSnackNotification';
import { LolLobbyV2ReceivedInvitations } from '@shared/typings/lol/response/lolLobbyV2ReceivedInvitations';
import { SnackbarAction, useSnackbar as snackbar } from 'notistack';
import { createElement, useState } from 'react';

export const Invitations = () => {
  const { show } = useSnackNotification();
  const { closeSnackbar } = snackbar();
  const { makeRequest } = useLeagueClientRequest();
  const [fromSummonerName, setFromSummonerName] = useState('');

  const handleAcceptInvitation = (data: LolLobbyV2ReceivedInvitations[]) => {
    makeRequest(
      'POST',
      buildEventUrl(
        '/lol-lobby/v2/received-invitations/{invitationId}/accept',
        data[0].invitationId,
      ),
      undefined,
    );
  };

  const handleDeclineInvitation = (data: LolLobbyV2ReceivedInvitations[]) => {
    makeRequest(
      'POST',
      buildEventUrl(
        '/lol-lobby/v2/received-invitations/{invitationId}/decline',
        data[0].invitationId,
      ),
      undefined,
    );
  };

  useLeagueClientEvent(
    '/lol-lobby/v2/received-invitations',
    (data: LolLobbyV2ReceivedInvitations[]) => {
      makeRequest(
        'GET',
        buildEventUrl(
          '/lol-summoner/v1/summoners/{digits}',
          data[0].fromSummonerId,
        ),
        undefined,
      ).then((res) => {
        if (res.ok) {
          setFromSummonerName(res.body.gameName);

          const greetString = `${fromSummonerName} sent a game invite!`;
          const acceptAction: SnackbarAction = (key) => {
            return createElement(
              Button,
              {
                variant: 'text',
                color: 'success',
                onClick: () => {
                  handleAcceptInvitation(data);
                  closeSnackbar(key);
                },
              },
              'Accept',
            );
          };

          const declineAction: SnackbarAction = (key) => {
            return createElement(
              Button,
              {
                variant: 'text',
                color: 'error',
                onClick: () => {
                  handleDeclineInvitation(data);
                  closeSnackbar(key);
                },
              },
              'Decline',
            );
          };

          show({
            message: greetString,
            variant: 'default',
            persist: true,
            preventDuplicate: true,
            action: (key) => [acceptAction(key), declineAction(key)],
          });
        }
      });
    },
  );

  return <></>;
};
