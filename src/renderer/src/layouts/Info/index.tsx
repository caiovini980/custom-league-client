import { Grid } from '@mui/material';
import { HighEloPlayers } from '@render/layouts/Info/HighEloPlayers';
import { Offers } from '@render/layouts/Info/Offers';
import { PatchNotes } from '@render/layouts/Info/PatchNotes';

export const Info = () => {
  return (
    <Grid container width={'100%'} height={'100%'} overflow={'auto'}>
      <Grid container height={{ xs: 'max-content', lg: '60%' }} size={12}>
        <Grid size={{ xs: 12, lg: 6 }} minHeight={350}>
          <PatchNotes />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }} overflow={'auto'} height={'100%'}>
          <HighEloPlayers />
        </Grid>
      </Grid>
      <Grid container width={'100%'} height={{ xs: 320, lg: '40%' }}>
        <Offers size={{ xs: 12, md: 6, lg: 3 }} />
      </Grid>
    </Grid>
  );
};
