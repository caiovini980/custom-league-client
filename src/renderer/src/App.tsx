import { Box, Stack } from '@mui/material';
import { BottomBar } from '@render/layouts/BottomBar';
import { CheckLeagueClient } from '@render/layouts/CheckLeagueClient';
import { LoadingLeagueClient } from '@render/layouts/CheckLeagueClient/LoadingLeagueClient';
import { Home } from '@render/layouts/Home';
import { CustomThemeProvider } from '@render/providers/CustomThemeProvider';
import { SnackbarProvider } from 'notistack';
import { JSX } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

export const App = (): JSX.Element => {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <CustomThemeProvider>
        <HashRouter>
          <CheckLeagueClient />
          <Stack direction={'column'} height={'100vh'}>
            <Box overflow={'auto'} height={'100%'}>
              <Routes>
                <Route path={'/home'} Component={Home} />
                <Route path={'/'} Component={LoadingLeagueClient} />
              </Routes>
            </Box>
            <BottomBar />
          </Stack>
        </HashRouter>
      </CustomThemeProvider>
    </SnackbarProvider>
  );
};
