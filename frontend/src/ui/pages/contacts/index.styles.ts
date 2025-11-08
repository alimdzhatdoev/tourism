import {colorScheme, createStyles} from '@/core/utils'

export const styles = createStyles({
  block: theme => ({
    alignItems: 'flex-start',
    padding: '56px',
    borderRadius: '24px',
    flexDirection: 'row',
    backgroundColor: colorScheme(theme).background.card,
    margin: '0 0 56px',
    [theme.breakpoints.down('lg')]: {
      flexDirection: 'column',
      py: '0',
      margin: '0 0 36px',
      backgroundColor: 'transparent',
      gap: '24px',
    },
  }),
  blockColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  textColumn: {
    alignItems: 'flex-start',
  },
  text: {
    margin: '24px 0 0',
    padding: '0 32px 0 0',
  },
  form: {
    padding: '36px',
  },
  banner: {
    maxWidth: '100%',
  },
})
