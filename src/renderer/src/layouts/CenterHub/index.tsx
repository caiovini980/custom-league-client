import { Grid } from '@mui/material';
import { HighEloPlayers } from './HighEloPlayers';
import { News } from './News';
import { Offers } from './Offers/Offers';
import { PatchNotes } from './PatchNotes';

export const CenterHub = () => {
  return (
    <Grid container width={'100%'} height={'100%'} overflow={'auto'}>
      <Grid container height={{ xs: 'max-content', lg: '60%' }} size={12}>
        <Grid size={{ xs: 12, lg: 6 }} minHeight={350}>
          <PatchNotes />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }} overflow={'auto'} height={'100%'}>
          <News />
        </Grid>
      </Grid>
      <Grid container width={'100%'} height={{ xs: 'auto', lg: '40%' }}>
        <Offers
          height={{ xs: 320, lg: '100%' }}
          size={{ xs: 12, md: 6, lg: 3 }}
        />
        <Grid height={{ lg: '100%' }} size={{ xs: 12, lg: 6 }}>
          <HighEloPlayers />
        </Grid>
      </Grid>
    </Grid>
  );
};
