import { Stack } from '@mui/material';
import { SquareIcon } from '@render/components/SquareIcon';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { LolChampSelectV1Session } from '@shared/typings/lol/response/lolChampSelectV1Session';

interface SpellSelectProps {
  session: LolChampSelectV1Session;
}

export const SpellSelect = ({ session }: SpellSelectProps) => {
  const { spellIcon } = useLeagueImage();

  const { spell1Id, spell2Id } = session.myTeam[session.localPlayerCellId];

  const iconSize = 30;

  return (
    <Stack direction={'row'} columnGap={0.5}>
      <SquareIcon src={spellIcon(spell1Id)} size={iconSize} />
      <SquareIcon src={spellIcon(spell2Id)} size={iconSize} />
    </Stack>
  );
};
