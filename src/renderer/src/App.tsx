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
          <Routes>
            <Route path={'/home'} Component={Home} />
            <Route path={'/'} Component={LoadingLeagueClient} />
          </Routes>
        </HashRouter>
      </CustomThemeProvider>
    </SnackbarProvider>
  );
};
