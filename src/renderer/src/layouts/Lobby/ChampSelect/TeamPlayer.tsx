import {
  LolChampSelectV1Session,
  LolChampSelectV1SessionTeam,
} from '@shared/typings/lol/response/lolChampSelectV1Session';
import { Avatar, Paper, Stack, Typography } from '@mui/material';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { SquareIcon } from '@render/components/SquareIcon';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';

interface TeamPlayerProps {
  session: LolChampSelectV1Session;
  team: LolChampSelectV1SessionTeam[];
  bans: number[];
}

export const TeamPlayer = ({ team, bans }: TeamPlayerProps) => {
  const { championIcon, spellIcon } = useLeagueImage();
  const { rcpFeLolChampSelect } = useLeagueTranslate();

  const rcpFeLolChampSelectTrans = rcpFeLolChampSelect('trans');

  return (
    <Stack direction={'column'} rowGap={2} width={250} height={'100%'}>
      <Stack direction={'row'} columnGap={0.5}>
        {bans.map((b) => {
          return (
            <Avatar
              key={b}
              src={championIcon(b)}
              sx={{ height: 15, width: 15 }}
            />
          );
        })}
      </Stack>
      {team.map((m) => {
        return (
          <Stack
            component={Paper}
            key={m.summonerId}
            direction={'row'}
            sx={{ p: 1 }}
            columnGap={0.5}
          >
            <Avatar src={championIcon(m.championPickIntent || m.championId)} />
            <Stack direction={'column'}>
              <Typography>
                {rcpFeLolChampSelectTrans(
                  `summoner_assigned_position_${m.assignedPosition.toLocaleLowerCase()}`,
                )}
              </Typography>
              <Typography fontSize={'0.6rem'}>{m.gameName}</Typography>
            </Stack>
            <Stack direction={'row'}>
              <SquareIcon src={spellIcon(m.spell1Id)} />
              <SquareIcon src={spellIcon(m.spell2Id)} />
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
};
