import { Typography } from '@mui/material';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';

interface FirstPickLabelProps {
  isEnemyTeam: boolean;
}

export const FirstPickLabel = ({ isEnemyTeam }: FirstPickLabelProps) => {
  const { rcpFeLolChampSelect } = useLeagueTranslate();
  const benchEnabled = champSelectStore.getSessionData(
    (session) => session.benchEnabled,
  );
  const action = champSelectStore.getSessionData((session) =>
    session.actions.flat().find((a) => a.type === 'pick'),
  );

  const { rcpFeLolChampSelectTrans } = rcpFeLolChampSelect;

  const getFirstPickLabel = () => {
    if (benchEnabled) return '';
    if (!action) return '';
    if (
      (isEnemyTeam && !action.isAllyAction) ||
      (!isEnemyTeam && action.isAllyAction)
    ) {
      return rcpFeLolChampSelectTrans('first_pick');
    }
    return '';
  };

  return (
    <Typography
      textAlign={isEnemyTeam ? 'right' : 'left'}
      height={18}
      color={'highlight'}
      my={1}
    >
      {getFirstPickLabel()}
    </Typography>
  );
};
