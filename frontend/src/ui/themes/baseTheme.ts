import {createTheme} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import '@fontsource-variable/montserrat'
import '@fontsource-variable/oswald'

export const APP_FONTS = {
  montserrat: 'Montserrat Variable',
  oswald: 'Oswald Variable',
}

declare module '@mui/material/styles' {
  interface Palette {
    brandAccent: Palette['primary']
  }

  interface PaletteOptions {
    brandAccent?: PaletteOptions['primary']
  }
}

export const baseTheme = createTheme({
  components: {
    MuiCssBaseline: {
      defaultProps: {enableColorScheme: true},
      styleOverrides: {
        '& html': {
          height: '100%',
          width: '100%',
          fontSynthesis: 'none',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          WebkitTextSizeAdjust: '100%',
        },
        '& body': {
          minHeight: '100vh',
          maxWidth: '100%',
          minWidth: '320px',
          fontFeatureSettings: "'lnum' on",
          fontFamily: `'${APP_FONTS.montserrat}', '${APP_FONTS.oswald}', sans-serif`,
        },
        '& a:link, a:visited': {
          textDecoration: 'none',
          color: 'inherit',
        },
        '& a:hover, a:active': {
          textDecoration: 'none',
          color: 'inherit',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: '44px',
          height: '44px',
          fontSize: '10px',
        },
      },
    },
    MuiSkeleton: {
      defaultProps: {
        animation: 'wave',
      },
      styleOverrides: {
        wave: {
          borderRadius: '12px',
          transform: 'none',
        },
      },
    },
    MuiPaginationItem: {
      defaultProps: {
        slots: {
          previous: ArrowBackIcon,
          next: ArrowForwardIcon,
        },
      },
      styleOverrides: {
        root: {
          width: '35px',
          height: '35px',
          fontSize: '20px',
          background: 'none !important',
          backgroundColor: 'transparent',
        },
        previousNext: {
          borderRadius: 9999,
        },
      },
    },
    MuiBreadcrumbs: {
      defaultProps: {
        separator: '•',
      },
      styleOverrides: {
        root: {
          margin: '24px 0 0',
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        disableElevation: true,
        disableFocusRipple: true,
        disableTouchRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontFamily: APP_FONTS.montserrat,
          fontSize: '16px !important',
          '&:hover': {
            background: 'none',
          },
        },
        text: {
          padding: 0,
          textTransform: 'none',
          gap: '10px',
        },
        contained: {
          borderRadius: 9999,
          fontSize: '20px',
          fontWeight: 600,
          padding: '18px 50px',
          lineHeight: '24px',
        },
        outlined: {
          padding: '18px 50px',
          borderRadius: 9999,
          width: 'fit-content',
          fontWeight: 600,
          lineHeight: '21px',
          backgroundColor: 'transparent !important',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '20px !important',
          '& fieldset': {
            border: 'none',
          },
        },
        input: {
          padding: '20px 24px !important',
        },
        multiline: {
          borderRadius: '20px !important',
          padding: '0 13px 0 0 !important',
          '&::placeholder': {
            opacity: 1,
          },
        },
      },
    },
  },
  typography: {
    fontFamily: APP_FONTS.montserrat,
    h1: {
      fontSize: '60px',
      fontWeight: 700,
      textAlign: 'center',
    },
  },
})
