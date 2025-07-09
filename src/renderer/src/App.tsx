import { Stack } from '@mui/material';
import ErrorBoundary from '@render/components/ErrorBoundary';
import { BottomBar } from '@render/layouts/BottomBar';
import { CheckLeagueClient } from '@render/layouts/CheckLeagueClient';
import { Home } from '@render/layouts/Home';
import { Info } from '@render/layouts/Info';
import { LeagueClientEvent } from '@render/layouts/LeagueClientEvent';
import { Lobby } from '@render/layouts/Lobby';
import { Profile } from '@render/layouts/Profile';
import { YourShop } from '@render/layouts/YourShop';
import { CustomThemeProvider } from '@render/providers/CustomThemeProvider';
import { SnackbarProvider } from 'notistack';
import { JSX } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Loot } from '@render/layouts/Loot';

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
                    <Route path={'/'} Component={Info} />
                    <Route path={'/lobby'} Component={Lobby} />
                    <Route path={'/profile'} Component={Profile} />
                    <Route path={'/yourshop'} Component={YourShop} />
                    <Route path={'/loot'} Component={Loot} />
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
