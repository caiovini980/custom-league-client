import { Stack, Typography } from '@mui/material';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { LolEndOfGameV1EogStatsBlock } from '@shared/typings/lol/response/lolEndOfGameV1EogStatsBlock';

interface TitleProps {
  data: LolEndOfGameV1EogStatsBlock;
}

export const Title = ({ data }: TitleProps) => {
  const { rcpFeLolPostgame, rcpFeLolSharedComponents } = useLeagueTranslate();

  const { rcpFeLolPostgameTrans } = rcpFeLolPostgame;
  const { rcpFeLolSharedComponentsTransLeagueTierNames } =
    rcpFeLolSharedComponents;

  const gameMode = rcpFeLolPostgameTrans(
    `postgame_tagline_${data.gameMode.toLowerCase()}`,
  );

  const queueName = rcpFeLolSharedComponentsTransLeagueTierNames(
    `lol_league_queue_name_${data.queueType.toLowerCase()}`,
  );

  return (
    <Stack direction={'row'} justifyContent={'center'}>
      <Typography fontSize={'1.6rem'}>
        {gameMode} {queueName && `(${queueName})`}
      </Typography>
    </Stack>
  );
};
