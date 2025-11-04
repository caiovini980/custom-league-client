import { LinearProgress, Stack, Typography } from '@mui/material';
import CustomDialog from '@render/components/CustomDialog';
import { useAudio } from '@render/hooks/useAudioManager';
import { useLeagueClientEvent } from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { electronHandle } from '@render/utils/electronFunction.util';
import { lobbyStore } from '@render/zustand/stores/lobbyStore';
import { LolMatchmakingV1ReadyCheck } from '@shared/typings/lol/response/lolMatchmakingV1ReadyCheck';
import { useEffect, useState } from 'react';

export const ReadyCheckModal = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolL10n } = useLeagueTranslate();
  const gameFound = useAudio('game_found');

  const { rcpFeLolL10nTrans } = rcpFeLolL10n;

  const autoAccept = lobbyStore.autoAccept.use();

  const [matchReadyCheck, setMatchReadyCheck] =
    useState<LolMatchmakingV1ReadyCheck>();

  useEffect(() => {
    if (matchReadyCheck?.state === 'InProgress') {
      gameFound.play();
      electronHandle.client.priorityApp();
    }
  }, [matchReadyCheck?.state]);

  useLeagueClientEvent(
    '/lol-matchmaking/v1/ready-check',
    (data) => {
      setMatchReadyCheck(data);
      if (
        autoAccept &&
        data.state === 'InProgress' &&
        data.playerResponse === 'None'
      ) {
        onClickGameAccept();
      }
    },
    {
      deps: [autoAccept],
    },
  );

  const onClickGameAccept = () => {
    makeRequest('POST', '/lol-matchmaking/v1/ready-check/accept', undefined);
  };

  const onClickGameDecline = () => {
    makeRequest('POST', '/lol-matchmaking/v1/ready-check/decline', undefined);
  };

  return (
    <CustomDialog
      maxWidth={'xs'}
      fullWidth
      title={rcpFeLolL10nTrans('ready_check_match_found')}
      open={matchReadyCheck?.state === 'InProgress'}
      handleConfirm={onClickGameAccept}
      handleClose={onClickGameDecline}
      labelBtnCancel={rcpFeLolL10nTrans('ready_check_decline_button')}
      labelBtnConfirm={rcpFeLolL10nTrans('ready_check_accept_button')}
      confirmButtonProps={{
        disabled: matchReadyCheck?.playerResponse !== 'None',
      }}
      cancelButtonProps={{
        disabled: matchReadyCheck?.playerResponse !== 'None',
      }}
    >
      <Stack
        width={'100%'}
        direction={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        rowGap={1}
      >
        {matchReadyCheck?.playerResponse === 'None' ? (
          <Typography>
            {rcpFeLolL10nTrans('ready_check_prepare_battle')}
          </Typography>
        ) : (
          <Typography>
            {rcpFeLolL10nTrans('ready_check_waiting_players')}
          </Typography>
        )}
        {matchReadyCheck?.playerResponse === 'Accepted' && (
          <Typography>
            {rcpFeLolL10nTrans('ready_check_response_message_accepted')}
          </Typography>
        )}
        {matchReadyCheck?.playerResponse === 'Declined' && (
          <Typography>
            {rcpFeLolL10nTrans('ready_check_response_message_declined')}
          </Typography>
        )}
        <LinearProgress
          variant={'determinate'}
          value={100 - (matchReadyCheck?.timer ?? 0) * 10}
          sx={{
            height: 30,
            width: '100%',
          }}
        />
      </Stack>
    </CustomDialog>
  );
};
