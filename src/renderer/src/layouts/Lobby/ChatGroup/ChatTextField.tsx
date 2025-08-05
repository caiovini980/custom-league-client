import { CircularProgress } from '@mui/material';
import { CustomTextField } from '@render/components/input';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { KeyboardEvent, useState } from 'react';
import { buildEventUrl } from '@render/hooks/useLeagueClientEvent';

interface ChatTextFieldProps {
  conversationId: string;
  loading: boolean;
  disabled: boolean;
}

export const ChatTextField = ({
  conversationId,
  loading,
  disabled,
}: ChatTextFieldProps) => {
  const { rcpFeLolSocial } = useLeagueTranslate();
  const { makeRequest } = useLeagueClientRequest();

  const { rcpFeLolSocialTrans } = rcpFeLolSocial;

  const [message, setMessage] = useState('');

  const handleSendMessage = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      makeRequest(
        'POST',
        buildEventUrl(
          '/lol-chat/v1/conversations/{id}/messages',
          conversationId,
        ),
        {
          body: message,
        },
      ).then((res) => {
        if (res.ok) {
          setMessage('');
        }
      });
      return;
    }
  };

  return (
    <CustomTextField
      maxRows={3}
      multiline
      placeholder={rcpFeLolSocialTrans('conversation_get_started_placeholder')}
      value={message}
      onChangeText={setMessage}
      onKeyDown={handleSendMessage}
      disabled={loading || disabled}
      startIcon={loading ? <CircularProgress size={16} /> : null}
      slotProps={{
        input: {
          sx: {
            p: 1,
            borderRadius: 0,
          },
        },
      }}
    />
  );
};
