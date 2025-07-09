import { Stack, Typography } from '@mui/material';
import { SquareIcon } from '@render/components/SquareIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { useChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';
import { TeamPlayerCard } from '@render/layouts/Lobby/ChampSelect/TeamPlayer/PlayerCard';

interface TeamPlayerProps {
  isEnemyTeam?: boolean;
}

export const TeamPlayer = ({ isEnemyTeam }: TeamPlayerProps) => {
  const { championIcon } = useLeagueImage();
  const { rcpFeLolChampSelect } = useLeagueTranslate();
  const { bans: bansData, session } = useChampSelectContext();

  const { rcpFeLolChampSelectTrans } = rcpFeLolChampSelect;

  const bans = isEnemyTeam ? bansData.theirTeam : bansData.myTeam;
  const team = isEnemyTeam ? session.theirTeam : session.myTeam;

  const getFirstPickLabel = () => {
    if (session.benchEnabled) return '';
    const action = session.actions.flat().find((a) => a.type === 'pick');
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
    <Stack direction={'column'} height={'100%'}>
      <Stack direction={'row'} justifyContent={'space-between'}>
        {bans.map((b, i) => {
          return <SquareIcon key={i} src={championIcon(b)} size={35} />;
        })}
      </Stack>
      <Typography
        textAlign={isEnemyTeam ? 'right' : 'left'}
        height={18}
        color={'highlight'}
        my={1}
      >
        {getFirstPickLabel()}
      </Typography>
      {team.map((m, index) => {
        return (
          <TeamPlayerCard
            key={m.cellId}
            player={m}
            slotId={isEnemyTeam ? index + team.length : index}
            isEnemyTeam={isEnemyTeam}
            amountPlayer={team.length}
          />
        );
      })}
    </Stack>
  );
};
