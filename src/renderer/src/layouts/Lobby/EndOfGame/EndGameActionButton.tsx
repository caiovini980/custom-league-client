import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { CustomButton } from '@render/components/input';
import { Stack } from '@mui/material';

export const EndGameActionButton = () => {
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolPostgame } = useLeagueTranslate();

  const { rcpFeLolPostgameTrans } = rcpFeLolPostgame;

  const dismissStats = () => {
    makeRequest('POST', '/lol-end-of-game/v1/state/dismiss-stats', undefined);
  };

  const onClickPlayAgain = () => {
    makeRequest('POST', '/lol-lobby/v2/play-again', undefined).then(() => {
      dismissStats();
    });
  };

  const onClickPlayAgainDecline = () => {
    dismissStats();
    makeRequest('POST', '/lol-lobby/v2/play-again-decline', undefined).then(
      () => {
        dismissStats();
      },
    );
  };

  return (
    <Stack direction={'column'} rowGap={1}>
      <CustomButton onClick={onClickPlayAgain} variant={'contained'}>
        {rcpFeLolPostgameTrans('career_postgame_button_play_again')}
      </CustomButton>
      <CustomButton onClick={onClickPlayAgainDecline} variant={'outlined'}>
        {rcpFeLolPostgameTrans('postgame_scoreboard_button_nav_quit')}
      </CustomButton>
    </Stack>
  );
};
