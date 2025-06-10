import { Stack } from '@mui/material';
import { BottomBar } from '@render/layouts/BottomBar';
import { CheckLeagueClient } from '@render/layouts/CheckLeagueClient';
import { Home } from '@render/layouts/Home';
import { LeagueClientEvent } from '@render/layouts/LeagueClientEvent';
import { Lobby } from '@render/layouts/Lobby';
import { Profile } from '@render/layouts/Profile';
import { CustomThemeProvider } from '@render/providers/CustomThemeProvider';
import { SnackbarProvider } from 'notistack';
import { JSX } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import ErrorBoundary from '@render/components/ErrorBoundary';
import { YourShop } from '@render/layouts/YourShop';

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
          <Stack direction={'column'} height={'100vh'}>
            <ErrorBoundary>
              <CheckLeagueClient>
                <LeagueClientEvent />
                <Home>
                  <Routes>
                    <Route path={'/'} element={<Navigate to={'lobby'} />} />
                    <Route path={'/lobby'} Component={Lobby} />
                    <Route path={'/profile'} Component={Profile} />
                    <Route path={'/yourshop'} Component={YourShop} />
                  </Routes>
                </Home>
              </CheckLeagueClient>
              <BottomBar />
            </ErrorBoundary>
          </Stack>
        </HashRouter>
      </CustomThemeProvider>
    </SnackbarProvider>
  );
};
