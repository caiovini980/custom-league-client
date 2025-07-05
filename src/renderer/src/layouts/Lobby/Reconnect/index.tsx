import { CentralizedStack } from '@render/components/CentralizedStack';
import { CustomButton } from '@render/components/input';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useState } from 'react';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { Typography } from '@mui/material';

export const Reconnect = () => {
  const { rcpFeLolL10n } = useLeagueTranslate();
  const { makeRequest } = useLeagueClientRequest();

  const [loading, setLoading] = useState(false);

  const { rcpFeLolL10nTrans } = rcpFeLolL10n;

  const onClickReconnect = () => {
    setLoading(true);
    makeRequest('POST', '/lol-gameflow/v1/reconnect', undefined).then(() => {
      setLoading(false);
    });
  };

  return (
    <CentralizedStack>
      <Typography>{rcpFeLolL10nTrans('postgame_reconnect_message')}</Typography>
      <CustomButton onClick={onClickReconnect} loading={loading}>
        {rcpFeLolL10nTrans('postgame_reconnect')}
      </CustomButton>
    </CentralizedStack>
  );
};
