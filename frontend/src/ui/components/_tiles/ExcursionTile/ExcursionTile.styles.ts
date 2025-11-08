import {colorScheme, createStyles} from '@/core/utils'

export const styles = createStyles({
  header: {
    fontWeight: 700,
    margin: '0 0 2px',
    flex: 1,
  },
  rating: theme => ({
    float: 'right',
    height: 'fit-content',
    padding: '0 10px',
    borderRadius: '5px',
    color: colorScheme(theme).text.contrast,
    backgroundColor: colorScheme(theme).background.cardSecondary,
  }),
  name: t => ({
    minWidth: '100%',
    width: 0,
    [t.breakpoints.down('lg')]: {
      fontSize: '14px',
    },
  }),
  locationName: {
    fontSize: '14px',
    margin: '0 0 8px',
  },
  minPrice: {
    margin: 'auto 0 0',
    fontWeight: 700,
    fontSize: '20px',
    '& span': {
      margin: '0 0 0 5px',
      fontWeight: 400,
      fontSize: '14px',
    },
  },
  button: t => ({
    margin: '8px 0 0',
    fontSize: '16px',
    padding: '8px',
    justifySelf: 'flex-end',
    [t.breakpoints.down('lg')]: {
      fontSize: '14px',
    },
  }),
})
