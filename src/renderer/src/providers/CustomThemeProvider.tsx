import { JSX, PropsWithChildren } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { useCustomTheme } from '@render/styles/useCustomTheme'
import { GlobalStyles } from '@render/styles/GlobalStyles'

export const CustomThemeProvider = ({
  children
}: PropsWithChildren<Record<never, never>>): JSX.Element => {
  const theme = useCustomTheme()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      {children}
    </ThemeProvider>
  )
}
