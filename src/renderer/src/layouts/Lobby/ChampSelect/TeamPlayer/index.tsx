import {
  LolChampSelectV1Session,
  LolChampSelectV1SessionTeam,
} from '@shared/typings/lol/response/lolChampSelectV1Session';
import { Stack } from '@mui/material';
import { TeamPlayerCard } from '@render/layouts/Lobby/ChampSelect/TeamPlayer/PlayerCard';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useChampSelectContext } from '@render/layouts/Lobby/ChampSelect/ChampSelectContext';
import { SquareIcon } from '@render/components/SquareIcon';

interface TeamPlayerProps {
  session: LolChampSelectV1Session;
  team: LolChampSelectV1SessionTeam[];
  isEnemyTeam?: boolean;
}

export const TeamPlayer = ({ team, session, isEnemyTeam }: TeamPlayerProps) => {
  const { championIcon } = useLeagueImage();
  const { bans: bansData } = useChampSelectContext();

  const bans = isEnemyTeam ? bansData.theirTeam : bansData.myTeam;

  return (
    <Stack direction={'column'} rowGap={2} width={250} height={'100%'}>
      <Stack direction={'row'} justifyContent={'space-between'}>
        {bans.map((b) => {
          return <SquareIcon key={b} src={championIcon(b)} size={35} />;
        })}
      </Stack>
      {team.map((m) => {
        return (
          <TeamPlayerCard
            key={m.cellId}
            player={m}
            isEnemyTeam={isEnemyTeam}
            session={session}
          />
        );
      })}
    </Stack>
  );
};
