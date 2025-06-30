import { Grid } from '@mui/material';
import { PatchNotes } from '@render/layouts/Info/PatchNotes';
import { Offers } from '@render/layouts/Info/Offers';
import { HighEloPlayers } from '@render/layouts/Info/HighEloPlayers';

export const Info = () => {
  return (
    <Grid
      container
      direction={'column'}
      wrap={'nowrap'}
      width={'100%'}
      overflow={'auto'}
    >
      <Grid
        container
        direction={{ xs: 'column', lg: 'row' }}
        wrap={'nowrap'}
        height={'100%'}
        minHeight={400}
      >
        <Grid size={{ xs: 12, lg: 6 }} height={'100%'}>
          <PatchNotes />
        </Grid>
        <Grid
          container
          direction={'column'}
          wrap={'nowrap'}
          size={{ xs: 12, lg: 6 }}
          height={'100%'}
        >
          <HighEloPlayers />
        </Grid>
      </Grid>
      <Grid
        container
        direction={{ xs: 'column', lg: 'row' }}
        width={'100%'}
        flexShrink={0}
        minHeight={350}
      >
        <Offers size={{ xs: 12, lg: 6 }} />
      </Grid>
    </Grid>
  );
};
