import {colorScheme, createStyles, rootStyle} from '@/core/utils'
import {alpha} from '@mui/material'

export const styles = createStyles({
  root: theme => ({
    ...rootStyle(theme),
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('lg')]: {
      px: '30px',
    },
  }),
  breadcrumbs: {
    margin: '0 0 24px',
    width: '100%',
  },
  header: theme => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 0 64px',
    [theme.breakpoints.down('lg')]: {
      width: '100%',
      margin: '0 0 30px',
    },
  }),
  headerSecondary: {
    margin: '0 0 16px',
  },
  headerLine: theme => ({
    height: '1px',
    flex: 1,
    backgroundColor: colorScheme(theme).text.primary,
    margin: '0px 30px',
  }),
  headerTitle: theme => ({
    textAlign: 'center',
    lineHeight: '56px',
    [theme.breakpoints.down('lg')]: {
      textAlign: 'left',
      fontSize: '30px',
      lineHeight: '34px',
      width: '100%',
      margin: '0 0 4px',
    },
  }),
  headerTitleSecondary: theme => ({
    fontSize: '28px',
    lineHeight: '32px',
    fontWeight: 600,
    textAlign: 'left',
    [theme.breakpoints.down('lg')]: {
      fontSize: '25px',
      lineHeight: '36px',
    },
  }),
  headerLink: theme => ({
    color: colorScheme(theme).text.primary + '! important',
    fontSize: '16px',
    border: `1px solid ${alpha(colorScheme(theme).text.primary, 0.3)}`,
    padding: '18px 42px',
    borderRadius: 9999,
  }),
})
