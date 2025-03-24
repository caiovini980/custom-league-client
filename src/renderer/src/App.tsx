import { CustomThemeProvider } from '@render/providers/CustomThemeProvider'
import { JSX } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { Home } from '@render/layouts/Home'

export const App = (): JSX.Element => {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
        <CustomThemeProvider>
          <HashRouter>
            <Routes>
              <Route path={'/'} Component={Home} />
            </Routes>
          </HashRouter>
        </CustomThemeProvider>
    </SnackbarProvider>
  )
}
