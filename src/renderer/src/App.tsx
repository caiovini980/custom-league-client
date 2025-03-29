import { Stack } from '@mui/material';
import { BottomBar } from '@render/layouts/BottomBar';
import { CheckLeagueClient } from '@render/layouts/CheckLeagueClient';
import { Home } from '@render/layouts/Home';
import { LeagueClientEvent } from '@render/layouts/LeagueClientEvent';
import { Lobby } from '@render/layouts/Lobby';
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
          <LeagueClientEvent />
          <Stack direction={'column'} height={'100vh'}>
            <CheckLeagueClient>
              <Home>
                <Routes>
                  <Route path={'/'} Component={Lobby} />
                </Routes>
              </Home>
            </CheckLeagueClient>
            <BottomBar />
          </Stack>
        </HashRouter>
      </CustomThemeProvider>
    </SnackbarProvider>
  );
};
