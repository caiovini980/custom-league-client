import { debounce, Stack } from '@mui/material';
import CustomDialog from '@render/components/CustomDialog';
import {
  CustomCheckBox,
  CustomSelect,
  CustomTextField,
} from '@render/components/input';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useLocalTranslate } from '@render/hooks/useLocalTranslate';
import { LolChatV1Friends } from '@shared/typings/lol/response/lolChatV1Friends';
import { useCallback, useEffect, useState } from 'react';

interface EditChatStatusProps {
  chatData: LolChatV1Friends;
  open: boolean;
  handleClose: () => void;
}

export const EditChatStatus = ({
  chatData,
  open,
  handleClose,
}: EditChatStatusProps) => {
  const { localTranslate } = useLocalTranslate();
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolSocial } = useLeagueTranslate();

  const { rcpFeLolSocialTrans, rcpFeLolSocialTransPlayerBehavior } =
    rcpFeLolSocial;

  const [statusMessage, setStatusMessage] = useState('');
  const [statusAvailability, setStatusAvailability] = useState('');
  const [keepStatus, setKeepStatus] = useState(false);

  const status = ['away', 'offline', 'chat', 'dnd'];

  const onChange = useCallback(
    debounce((availability: string, statusMessage: string) => {
      makeRequest('PUT', '/lol-chat/v1/me', {
        availability,
        statusMessage,
      });
    }, 1000),
    [],
  );

  useEffect(() => {
    if (keepStatus) {
      setStatusAvailability(statusAvailability);
      onChange(statusAvailability, statusMessage);
    } else {
      setStatusAvailability(chatData.availability);
    }
    setStatusMessage(chatData.statusMessage);
  }, [chatData.statusMessage, chatData.availability, keepStatus]);

  useEffect(() => {
    onChange(statusAvailability, statusMessage);
  }, [statusAvailability, statusMessage]);

  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      hiddenBtnConfirm
      labelBtnCancel={rcpFeLolSocialTransPlayerBehavior(
        'player_behavior_accept_notification_shutdown_text',
      )}
    >
      <Stack direction={'column'} rowGap={2} width={320} p={1}>
        <CustomTextField
          label={rcpFeLolSocialTrans('menu_item_set_status')}
          value={statusMessage}
          onChangeText={setStatusMessage}
        />
        <CustomSelect
          label={rcpFeLolSocialTrans('menu_item_status')}
          value={statusAvailability}
          onChangeValue={setStatusAvailability}
          options={status.map((s) => ({
            label: rcpFeLolSocialTrans(`availability_${s}`),
            value: s,
          }))}
        />
        <CustomCheckBox
          label={localTranslate('keep_status')}
          checked={keepStatus}
          onChange={setKeepStatus}
        />
      </Stack>
    </CustomDialog>
  );
};
