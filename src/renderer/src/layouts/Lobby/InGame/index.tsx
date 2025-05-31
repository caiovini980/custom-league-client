import { CentralizedStack } from '@render/components/CentralizedStack';
import { Typography } from '@mui/material';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';

export const InGame = () => {
  const { rcpFeLolL10n } = useLeagueTranslate();

  return (
    <CentralizedStack>
      <Typography>
        {rcpFeLolL10n('trans')('postgame_game_in_progress')}
      </Typography>
    </CentralizedStack>
  );
};
