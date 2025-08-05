import {
  buildEventUrl,
  useLeagueClientEvent,
} from '@render/hooks/useLeagueClientEvent';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { HonorScreen } from '@render/layouts/Lobby/PreEndGame/HonorScreen';
import { PreEndOfGameGenericScreen } from '@render/layouts/Lobby/PreEndGame/PreEndOfGameGenericScreen';
import { useState } from 'react';

export const PreEndGame = () => {
  const { makeRequest } = useLeagueClientRequest();

  const [currentSequence, setCurrentSequence] = useState('');

  useLeagueClientEvent(
    '/lol-pre-end-of-game/v1/currentSequenceEvent',
    (data) => {
      setCurrentSequence(data.name);
    },
  );

  const onClickContinue = () => {
    makeRequest(
      'POST',
      buildEventUrl('/lol-pre-end-of-game/v1/complete/{id}', currentSequence),
      undefined,
    ).then();
  };

  if (currentSequence === 'honor-vote') {
    return <HonorScreen onClickContinue={onClickContinue} />;
  }

  return (
    <PreEndOfGameGenericScreen
      currentSequence={currentSequence}
      toNext={onClickContinue}
    />
  );
};
