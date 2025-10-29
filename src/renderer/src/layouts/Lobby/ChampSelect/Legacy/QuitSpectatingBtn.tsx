import { CustomButton } from '@render/components/input';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useState } from 'react';

export const QuitSpectatingBtn = () => {
  const { rcpFeLolChampSelect } = useLeagueTranslate();
  const { makeRequest } = useLeagueClientRequest();

  const { rcpFeLolChampSelectTrans } = rcpFeLolChampSelect;

  const [quiting, setQuiting] = useState(false);

  const handleQuit = () => {
    setQuiting(true);
    makeRequest(
      'POST',
      '/lol-lobby/v1/lobby/custom/cancel-champ-select',
      undefined,
    ).then(() => {
      setQuiting(false);
    });
  };

  return (
    <CustomButton variant={'contained'} onClick={handleQuit} loading={quiting}>
      {rcpFeLolChampSelectTrans('quit_spectating')}
    </CustomButton>
  );
};
