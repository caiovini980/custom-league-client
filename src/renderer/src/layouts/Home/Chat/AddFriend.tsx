import {
  CustomButton,
  CustomIconButton,
  CustomTextField,
} from '@render/components/input';
import { FaUserPlus } from 'react-icons/fa6';
import CustomDialog, {
  CustomDialogCloseFloatingButton,
} from '@render/components/CustomDialog';
import { useState } from 'react';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { Stack, Typography } from '@mui/material';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';
import { useSnackNotification } from '@render/hooks/useSnackNotification';

export const AddFriend = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { snackSuccess, snackError } = useSnackNotification();
  const { rcpFeLolSocial, rcpFeLolSharedComponents, rcpFeLolPostgame } =
    useLeagueTranslate();

  const [openModal, setOpenModal] = useState(false);
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');

  const rcpFeLolSocialTrans = rcpFeLolSocial('trans');
  const rcpFeLolPostgameTrans = rcpFeLolPostgame('trans');
  const rcpFeLolSharedComponentsTrans = rcpFeLolSharedComponents('trans');

  const onClickAddFriend = async () => {
    const error = () => {
      snackError(rcpFeLolPostgameTrans('postgame_friend_request_error'));
    };

    const lookupPlayer = await makeRequest(
      'GET',
      buildEventUrl(
        '/lol-summoner/v1/alias/lookup?gameName={string}&tagLine={string}',
        encodeURIComponent(gameName),
        tagLine,
      ),
      undefined,
    );

    if (!lookupPlayer.ok) {
      error();
      return;
    }
    const request = await makeRequest('POST', '/lol-chat/v2/friend-requests', {
      puuid: lookupPlayer.body.puuid,
    });
    if (request.ok) {
      snackSuccess(rcpFeLolSocialTrans('friend_request_sent_details'));
      setTagLine('');
      setGameName('');
    } else {
      error();
    }
  };

  return (
    <>
      <CustomIconButton onClick={() => setOpenModal(true)} sx={{ p: 1 }}>
        <FaUserPlus size={14} />
      </CustomIconButton>
      <CustomDialog
        title={rcpFeLolSocialTrans('friend_finder_modal_title')}
        maxWidth={'md'}
        fullWidth
        open={openModal}
        actionsComponent={<div />}
      >
        <CustomDialogCloseFloatingButton
          handleClose={() => setOpenModal(false)}
        />
        <Stack direction={'column'} rowGap={2} width={'100%'}>
          <Typography>
            {rcpFeLolSocialTrans('friend_finder_modal_instructions_alias')}
          </Typography>
          <Stack direction={'row'} columnGap={2} width={'100%'}>
            <CustomTextField
              fullWidth
              label={rcpFeLolSharedComponentsTrans(
                'player_name_input_game_name_hint_text',
              )}
              value={gameName}
              onChangeText={setGameName}
            />
            <CustomTextField
              label={rcpFeLolSharedComponentsTrans(
                'player_name_input_tag_line_hint_text',
              )}
              startIcon={'#'}
              value={tagLine}
              onChangeText={setTagLine}
            />
            <CustomButton
              variant={'contained'}
              fullWidth
              sx={{ maxWidth: '150px' }}
              onClick={onClickAddFriend}
            >
              {rcpFeLolSocialTrans('tooltip_new_friend')}
            </CustomButton>
          </Stack>
        </Stack>
      </CustomDialog>
    </>
  );
};
