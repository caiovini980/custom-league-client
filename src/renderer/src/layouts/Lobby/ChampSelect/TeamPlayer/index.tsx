import { Stack } from '@mui/material';
import { TeamPlayerCard } from '@render/layouts/Lobby/ChampSelect/TeamPlayer/PlayerCard';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';
import { SquareIcon } from '@render/components/SquareIcon';

interface TeamPlayerProps {
  isEnemyTeam?: boolean;
}

export const TeamPlayer = ({ isEnemyTeam }: TeamPlayerProps) => {
  const { championIcon } = useLeagueImage();
  const { bans: bansData, session } = useChampSelectContext();

  const bans = isEnemyTeam ? bansData.theirTeam : bansData.myTeam;
  const team = isEnemyTeam ? session.theirTeam : session.myTeam;

  return (
    <Stack direction={'column'} rowGap={2} height={'100%'}>
      <Stack direction={'row'} justifyContent={'space-between'}>
        {bans.map((b, i) => {
          return <SquareIcon key={i} src={championIcon(b)} size={35} />;
        })}
      </Stack>
      {team.map((m, index) => {
        return (
          <TeamPlayerCard
            key={m.cellId}
            player={m}
            slotId={isEnemyTeam ? index + team.length : index}
            isEnemyTeam={isEnemyTeam}
            side={m.team === 1 ? 'blue' : 'red'}
            amountPlayer={team.length}
          />
        );
      })}
    </Stack>
  );
};
