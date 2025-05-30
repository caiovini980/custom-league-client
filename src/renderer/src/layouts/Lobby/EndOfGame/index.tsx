import { CentralizedStack } from '@render/components/CentralizedStack';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { CustomButton } from '@render/components/input';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';

export const EndOfGame = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolPostgame } = useLeagueTranslate();

  const rcpFeLolPostgameTrans = rcpFeLolPostgame('trans');

  const onClickPlayAgain = () => {
    makeRequest('POST', '/lol-lobby/v2/play-again', undefined).then();
  };

  return (
    <CentralizedStack>
      <CustomButton onClick={onClickPlayAgain} variant={'contained'}>
        {rcpFeLolPostgameTrans('career_postgame_button_play_again')}
      </CustomButton>
    </CentralizedStack>
  );
};
