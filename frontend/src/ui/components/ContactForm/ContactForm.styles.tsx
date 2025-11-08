import {createStyles, colorScheme} from '@/core/utils'

export const styles = createStyles({
  root: theme => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '24px',
    padding: '56px 24px',
    backgroundColor: colorScheme(theme).background.feedbackForm,
    [theme.breakpoints.down('lg')]: {
      borderRadius: 'unset',
    },
  }),
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '530px',
    gap: '16px',
  },
  formTitle: theme => ({
    lineHeight: '56px',
    fontSize: '56px',
    fontWeight: 700,
    [theme.breakpoints.down('lg')]: {
      lineHeight: '36px',
      fontSize: '36px',
    },
  }),
  formText: {
    textAlign: 'center',
    margin: '0 0 20px',
  },
  formButton: theme => ({
    margin: '8px 0 0',
    maxWidth: '336px',
    width: '100%',
    [theme.breakpoints.down('lg')]: {
      maxWidth: '100%',
    },
  }),
})
