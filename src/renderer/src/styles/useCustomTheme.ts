import { createTheme, responsiveFontSizes } from '@mui/material'
import { useMemo } from 'react'

export const useCustomTheme = () => {
  return useMemo(
    () =>
      responsiveFontSizes(
        createTheme({
          palette: {
            mode: 'dark',
            primary: {
              main: '#00a0c7'
            },
            secondary: {
              main: '#95160C'
            },
            text: {
              primary: '#e5e5e5'
            },
            background: {
              default: '#212121',
              paper: '#2c2c2c'
            },
            error: {
              main: '#e05252'
            }
          },
          typography: {
            fontFamily: 'Nunito'
          },
          components: {
            MuiButton: {
              styleOverrides: {
                root: {
                  fontSize: '0.9rem',
                  textTransform: 'unset'
                }
              }
            },
            MuiTab: {
              styleOverrides: {
                root: {
                  textTransform: 'unset'
                }
              }
            }
          }
        })
      ),
    []
  )
}
