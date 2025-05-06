import { Button /*Typography*/ } from '@mui/material';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useSnackNotification } from '@render/hooks/useSnackNotification';
import { LolLobbyV2ReceivedInvitations } from '@shared/typings/lol/response/lolLobbyV2ReceivedInvitations';
import { SnackbarAction, useSnackbar as snackbar } from 'notistack';
import { createElement } from 'react';

export const Invitations = () => {
  const { show } = useSnackNotification();
  const { closeSnackbar } = snackbar();
  const { makeRequest } = useLeagueClientRequest();

  const handleAcceptInvitation = (id: string) => {
    makeRequest(
      'POST',
      buildEventUrl(
        '/lol-lobby/v2/received-invitations/{invitationId}/accept',
        id,
      ),
      undefined,
    );
  };

  const handleDeclineInvitation = (id: string) => {
    makeRequest(
      'POST',
      buildEventUrl(
        '/lol-lobby/v2/received-invitations/{invitationId}/decline',
        id,
      ),
      undefined,
    );
  };

  useLeagueClientEvent(
    '/lol-lobby/v2/received-invitations',
    (data: LolLobbyV2ReceivedInvitations[]) => {
      data.forEach((each) => {
        makeRequest(
          'GET',
          buildEventUrl(
            '/lol-summoner/v1/summoners/{digits}',
            each.fromSummonerId,
          ),
          undefined,
        ).then((res) => {
          if (res.ok) {
            const greetString = `${res.body.gameName} sent a game invite!`;
            const acceptAction: SnackbarAction = (key) => {
              return createElement(
                Button,
                {
                  variant: 'text',
                  color: 'success',
                  onClick: () => {
                    handleAcceptInvitation(each.invitationId);
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
                    handleDeclineInvitation(each.invitationId);
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
      });
    },
  );

  return <></>;
};
