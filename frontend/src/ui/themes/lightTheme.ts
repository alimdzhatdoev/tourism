import {Theme, alpha, createTheme} from '@mui/material'
import {baseTheme} from './baseTheme'
import {RecursivePartial} from 'types-helpers'
import {colors} from '@/constants'

const MODE: Theme['palette']['mode'] = 'light'

const themeOptions: RecursivePartial<Theme> = {
  palette: {
    mode: MODE,
    text: {
      primary: colors[MODE].text.primary,
    },
  },
  components: {
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(colors[MODE].background.avatar, 0.3),
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: colors[MODE].text.circularProgress,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        wave: {
          backgroundColor: colors[MODE].background.skeleton,
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .Mui-selected': {
            color: colors[MODE].text.contrast,
            backgroundColor: `${colors[MODE].text.primary} !important`,
            borderRadius: '10px',
          },
        },
        ul: {
          gap: '8px',
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        selected: {},
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        li: {
          color: colors[MODE].text.dimmed,
          '&:last-child': {
            color: colors[MODE].text.primary,
          },
        },
        separator: {
          color: colors[MODE].text.dimmed,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        text: {
          color: colors[MODE].text.primary,
        },
        containedPrimary: {
          backgroundColor: colors[MODE].background.button,
          '&:hover': {
            backgroundColor: colors[MODE].background.button,
          },
        },
        outlinedPrimary: {
          color: colors[MODE].text.outlinedButton,
          borderColor: colors[MODE].border.outlinedButton,
          '&:hover': {
            background: 'none',
            color: colors[MODE].text.outlinedButton,
            borderColor: colors[MODE].border.outlinedButton,
          },
        },
        outlinedSecondary: {
          color: colors[MODE].background.root,
          borderColor: colors[MODE].background.root,
          '&:hover': {
            color: colors[MODE].background.root,
            borderColor: colors[MODE].background.root,
          },
          '&:disabled': {
            color: colors[MODE].background.root,
            borderColor: colors[MODE].background.root,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': {
            border: `1px solid ${colors[MODE].border.outlinedInput}`,
          },
          '&.Mui-focused fieldset': {
            borderColor:
              colors[MODE].border.outlinedInputFocused + ' !important',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& fieldset': {
            border: 'none',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: colors.light.background.input,
        },
      },
    },
  },
}

export const lightTheme = createTheme(baseTheme, themeOptions)
