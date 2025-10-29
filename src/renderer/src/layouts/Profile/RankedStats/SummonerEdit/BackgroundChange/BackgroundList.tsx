import { ButtonBase, Grid, Paper, Typography } from '@mui/material';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';

interface BackgroundData {
  id: number;
  imgUrl: string;
  name: string;
}

interface BackgroundListProps {
  list: BackgroundData[];
}

export const BackgroundList = ({ list }: BackgroundListProps) => {
  const { makeRequest } = useLeagueClientRequest();

  const onClickSkin = (skinId: number) => {
    makeRequest('POST', '/lol-summoner/v1/current-summoner/summoner-profile', {
      key: 'backgroundSkinId',
      value: skinId,
    }).then(() => {});
  };

  return (
    <Grid
      container
      borderTop={'1px solid var(--mui-palette-divider)'}
      mt={2}
      pt={2}
      spacing={2}
    >
      {list.map((b) => (
        <Grid key={b.id}>
          <Paper
            component={ButtonBase}
            sx={{
              p: 1,
              background: `linear-gradient(0deg, rgba(0,0,0,0.8) 10%, rgba(0,0,0,0) 25%), url(${b.imgUrl})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              width: 250,
              height: 250,
              alignItems: 'flex-end',
            }}
            onClick={() => onClickSkin(b.id)}
          >
            <Typography>{b.name}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
