import { Stack, Typography } from '@mui/material';
import { TeamPlayerCard } from '@render/layouts/Lobby/ChampSelect/TeamPlayer/PlayerCard';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';
import { SquareIcon } from '@render/components/SquareIcon';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';

interface TeamPlayerProps {
  isEnemyTeam?: boolean;
}

export const TeamPlayer = ({ isEnemyTeam }: TeamPlayerProps) => {
  const { championIcon } = useLeagueImage();
  const { rcpFeLolChampSelect } = useLeagueTranslate();
  const { bans: bansData, session } = useChampSelectContext();

  const rcpFeLolChampSelectTrans = rcpFeLolChampSelect('trans');

  const bans = isEnemyTeam ? bansData.theirTeam : bansData.myTeam;
  const team = isEnemyTeam ? session.theirTeam : session.myTeam;

  const getFirstPickLabel = () => {
    if (session.benchEnabled) return '';
    const action = session.actions.flat().find((a) => a.type === 'pick');
    if (!action) return '';
    if ((isEnemyTeam && !action.isAllyAction) || action.isAllyAction) {
      return rcpFeLolChampSelectTrans('first_pick');
    }
    return '';
  };

  return (
    <Stack direction={'column'} rowGap={2} height={'100%'}>
      <Stack direction={'row'} justifyContent={'space-between'}>
        {bans.map((b, i) => {
          return <SquareIcon key={i} src={championIcon(b)} size={35} />;
        })}
      </Stack>
      <Typography
        textAlign={isEnemyTeam ? 'right' : 'left'}
        height={10}
        color={'highlight'}
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
