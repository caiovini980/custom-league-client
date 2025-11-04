import {
  ButtonBase,
  Divider,
  Grid,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useLeagueClientRequest } from '@render/hooks/useLeagueClientRequest';
import { useLeagueImage } from '@render/hooks/useLeagueImage';
import { useLeagueTranslate } from '@render/hooks/useLeagueTranslate';
import { InventoryOwnedData } from '@render/zustand/stores/currentSummonerStore';
import { formatOnlyDate } from '@shared/utils/date.util';

interface IconListProps {
  year: string;
  list: InventoryOwnedData[];
}

export const IconList = ({ year, list }: IconListProps) => {
  const { lolGameDataImg } = useLeagueImage();
  const { makeRequest } = useLeagueClientRequest();
  const { rcpFeLolSharedComponents } = useLeagueTranslate();

  const { rcpFeLolSharedComponentsTrans } = rcpFeLolSharedComponents;

  const handleChange = (summonerIconId: number) => {
    makeRequest('PUT', '/lol-summoner/v1/current-summoner/icon', {
      profileIconId: summonerIconId,
    }).then();
  };

  return (
    <Grid container pt={2} spacing={2}>
      <Divider textAlign={'center'} sx={{ width: '100%', fontSize: '1.2rem' }}>
        {rcpFeLolSharedComponentsTrans('identity_tooltip_icon_date_full', year)}
      </Divider>
      {list.map((b) => (
        <Grid key={b.id}>
          <Tooltip
            title={
              <Stack direction={'column'} alignItems={'center'} rowGap={2}>
                <Typography fontSize={'1.2rem'}>{b.name}</Typography>
                <Typography fontSize={'0.8rem'}>{b.description}</Typography>
                <Typography fontSize={'0.8rem'} color={'textDisabled'}>
                  {rcpFeLolSharedComponentsTrans(
                    'identity_tooltip_icon_date_full',
                    formatOnlyDate(b.purchaseDate),
                  )}
                </Typography>
              </Stack>
            }
          >
            <Paper
              component={ButtonBase}
              sx={{
                p: 1,
                background: `url(${lolGameDataImg(b.img)})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                width: 100,
                height: 100,
                alignItems: 'flex-end',
              }}
              onClick={() => handleChange(b.id)}
            />
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );
};
