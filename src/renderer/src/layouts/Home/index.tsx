import {
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { Profile } from '@render/layouts/Home/Profile';
import { useStore } from '@render/zustand/store';
import { PropsWithChildren } from 'react';

export const Home = ({ children }: PropsWithChildren) => {
  const isAvailable = useStore().leagueClient.isAvailable();

  return (
    <Box overflow={'auto'} height={'100%'} width={'100%'}>
      <Stack direction={'row'} height={'inherit'}>
        <Box overflow={'auto'} height={'100%'} width={'100%'}>
          {isAvailable ? (
            children
          ) : (
            <Stack
              direction={'column'}
              rowGap={2}
              justifyContent={'center'}
              alignItems={'center'}
              height={'100%'}
              width={'100%'}
            >
              <Typography>Loading...</Typography>
              <CircularProgress />
            </Stack>
          )}
        </Box>
        <Stack
          direction={'column'}
          overflow={'auto'}
          height={'100%'}
          width={250}
          borderLeft={(t) => `1px solid ${t.palette.divider}`}
        >
          <Profile />
          <Divider />
          chat
        </Stack>
      </Stack>
    </Box>
  );
};
