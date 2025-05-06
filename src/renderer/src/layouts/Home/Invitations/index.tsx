import { Button /*Typography*/ } from '@mui/material';
import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useSnackNotification } from '@render/hooks/useSnackNotification';
import { SnackbarAction, useSnackbar as snackbar } from 'notistack';
import { createElement, useState } from 'react';

export const Invitations = () => {
  const { show } = useSnackNotification();
  const { closeSnackbar } = snackbar();
  const { makeRequest } = useLeagueClientRequest();
  const [fromSummonerName, setFromSummonerName] = useState('');

  useLeagueClientEvent('/lol-lobby/v2/received-invitations', (data) => {
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
              onClick: () => closeSnackbar(key),
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
              onClick: () => closeSnackbar(key),
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

  // const handlePopNotificationPress = () => {};
  return <></>;
  // return (
  // <Button onClick={handlePopNotificationPress}>
  //   <Typography>Pop notification</Typography>
  // </Button>
  // );
};
