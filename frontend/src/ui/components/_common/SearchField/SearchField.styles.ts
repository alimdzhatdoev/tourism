import {createStyles, colorScheme} from '@/core/utils'

export const styles = createStyles({
  root: {
    width: '100%',
    '& fieldset': {
      border: 'none',
    },
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
})
