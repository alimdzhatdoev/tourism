import {createStyles, colorScheme} from '@/core/utils'

export const styles = createStyles({
  root: theme => ({
    gap: '24px',
    maxWidth: '888px',
    margin: '20px 0',
    [theme.breakpoints.down('lg')]: {
      padding: '0 16px',
    },
  }),
  textField: {
    width: '100%',
  },
  input: theme => ({
    backgroundColor: colorScheme(theme).background.searchInput,
  }),
  startAdoornment: {
    margin: '0 0 0 6px',
    '& svg': {
      fontSize: '22px',
    },
  },
  endAdoornment: {
    margin: '0 10px 0',
    '& svg': {
      fontSize: '20px',
    },
  },
  button: {
    fontSize: '20px',
    lineHeight: '24px',
    minWidth: '224px',
  },
})
