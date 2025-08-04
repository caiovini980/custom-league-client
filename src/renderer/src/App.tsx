import { Stack } from '@mui/material';
import ErrorBoundary from '@render/components/ErrorBoundary';
import { BottomBar } from '@render/layouts/BottomBar';
import { CenterHub } from '@render/layouts/CenterHub';
import { CheckLeagueClient } from '@render/layouts/CheckLeagueClient';
import { Home } from '@render/layouts/Home';
import { Lobby } from '@render/layouts/Lobby';
import { Loot } from '@render/layouts/Loot';
import { Profile } from '@render/layouts/Profile';
import { YourShop } from '@render/layouts/YourShop';
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
          <Stack direction={'column'} height={'100vh'}>
            <ErrorBoundary>
              <CheckLeagueClient>
                <Home>
                  <Routes>
                    <Route path={'/'} Component={CenterHub} />
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
