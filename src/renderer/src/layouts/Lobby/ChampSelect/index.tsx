import { Grid, Stack } from '@mui/material';
import { withChampSelectSession } from '@render/hoc/withChampSelectSession';
import { AramBenchChampions } from '@render/layouts/Lobby/ChampSelect/AramBenchChampions';
import { CenterArea } from '@render/layouts/Lobby/ChampSelect/CenterArea';
import { Runes } from '@render/layouts/Lobby/ChampSelect/CenterArea/Runes';
import { SpellSelect } from '@render/layouts/Lobby/ChampSelect/CenterArea/SpellSelector/SpellSelect';
import { ChampionSelectChatGroup } from '@render/layouts/Lobby/ChampSelect/ChampionSelectChatGroup';
import { ChampionSelectWrapper } from '@render/layouts/Lobby/ChampSelect/ChampionSelectWrapper';
import { Legacy } from '@render/layouts/Lobby/ChampSelect/Legacy';
import { TeamPlayer } from '@render/layouts/Lobby/ChampSelect/TeamPlayer';
import { Timer } from '@render/layouts/Lobby/ChampSelect/Timer';
import { memo } from 'react';

export const ChampSelect = withChampSelectSession(({ isLegacy }) => {
  if (isLegacy) {
    return <Legacy />;
  }

  return (
    <ChampionSelectWrapper>
      <Content />
    </ChampionSelectWrapper>
  );
});

const Content = memo(function ChampionSelectContent() {
  return (
    <Stack
      direction={'column'}
      height={'100%'}
      width={'100%'}
      overflow={'auto'}
      p={1}
      rowGap={1}
    >
      <Timer />
      <AramBenchChampions />
      <Grid
        container
        direction={'row'}
        columnGap={1}
        justifyContent={'space-between'}
        height={'100%'}
        wrap={'nowrap'}
        overflow={'auto'}
      >
        <Grid size={'auto'}>
          <TeamPlayer />
        </Grid>
        <Grid size={'grow'}>
          <CenterArea />
        </Grid>
        <Grid size={'auto'}>
          <TeamPlayer isEnemyTeam />
        </Grid>
      </Grid>
      <Grid
        container
        direction={'row'}
        wrap={'nowrap'}
        height={200}
        flexShrink={0}
        columnGap={2}
        alignItems={'center'}
      >
        <Grid size={'grow'}>
          <ChampionSelectChatGroup />
        </Grid>
        <Grid size={'auto'}>
          <Stack
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            columnGap={2}
          >
            <Runes />
            <SpellSelect />
          </Stack>
        </Grid>
        <Grid size={'grow'}></Grid>
      </Grid>
    </Stack>
  );
});
