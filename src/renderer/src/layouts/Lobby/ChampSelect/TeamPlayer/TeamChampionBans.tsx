import { Stack } from '@mui/material';
import { SquareIcon } from '@render/components/SquareIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { champSelectStore } from '@render/zustand/stores/champSelectStore';

interface TeamChampionBansProps {
  isEnemyTeam: boolean;
}

export const TeamChampionBans = ({ isEnemyTeam }: TeamChampionBansProps) => {
  const { championIcon } = useLeagueImage();

  const bans = champSelectStore.bans.use();

  const bansChampionId = isEnemyTeam ? bans.theirTeam : bans.myTeam;

  return (
    <Stack direction={'row'} justifyContent={'space-between'}>
      {bansChampionId.map((b, i) => {
        return <SquareIcon key={i} src={championIcon(b)} size={35} />;
      })}
    </Stack>
  );
};
