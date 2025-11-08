import {rootStyle, createStyles, colorScheme} from '@core/utils'
import {alpha} from '@mui/material'

export const styles = createStyles({
  background: theme => ({
    margin: '80px 0 0',
    zIndex: 1,
    [theme.breakpoints.down('lg')]: {
      margin: '28px 0 0',
      padding: '0 0 68px',
    },
  }),
  root: theme => ({
    ...rootStyle(theme),
    padding: '53px 0 50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    color: theme.palette.getContrastText(colorScheme(theme).background.footer),
    [theme.breakpoints.down('lg')]: {
      padding: '36px 16px 24px',
      alignItems: 'center',
    },
  }),
  columnsList: theme => ({
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '20px',
    [theme.breakpoints.down('lg')]: {
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
    },
  }),
  columnItem: theme => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flexGrow: 1,
    flexShrink: 0,
    fontSize: '20px',
    [theme.breakpoints.down('lg')]: {
      maxWidth: 'fit-content',
    },
  }),
  columnHeader: {
    margin: '0 0 24px',
    color: 'inherit',
  },
  logo: {
    margin: '0 0 10px',
  },
  link: theme => ({
    fontWeight: 600,
    color: theme.palette.getContrastText(colorScheme(theme).background.footer),
  }),
  socialsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    fontSize: 'inherit',
  },
  socialLink: {
    width: '32px',
    aspectRatio: 1,
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px 2px 0 0',
    backgroundColor: t => alpha(colorScheme(t).text.primary, 0.15),
  },
})
