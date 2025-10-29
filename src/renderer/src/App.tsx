import { Stack } from '@mui/material';
import ErrorBoundary from '@render/components/ErrorBoundary';
import { GenericSnackBar } from '@render/components/SnackBar/GenericSnackBar';
import { BottomBar } from '@render/layouts/BottomBar';
import { CenterHub } from '@render/layouts/CenterHub';
import { CheckLeagueClient } from '@render/layouts/CheckLeagueClient';
import { Home } from '@render/layouts/Home';
import { Lobby } from '@render/layouts/Lobby';
import { Loot } from '@render/layouts/Loot';
import { Profile } from '@render/layouts/Profile';
import { Store } from '@render/layouts/Store';
import { YourShop } from '@render/layouts/YourShop';
import { CustomThemeProvider } from '@render/providers/CustomThemeProvider';
import { SnackbarProvider } from 'notistack';
import { HashRouter, Route, Routes } from 'react-router';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const App = () => {
  return (
    <CustomThemeProvider>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        Components={{
          default: GenericSnackBar,
          success: GenericSnackBar,
          error: GenericSnackBar,
          info: GenericSnackBar,
          warning: GenericSnackBar,
        }}
      >
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
                    <Route path={'/store'} Component={Store} />
                  </Routes>
                </Home>
              </CheckLeagueClient>
              <BottomBar />
            </ErrorBoundary>
          </Stack>
        </HashRouter>
      </SnackbarProvider>
    </CustomThemeProvider>
  );
};
