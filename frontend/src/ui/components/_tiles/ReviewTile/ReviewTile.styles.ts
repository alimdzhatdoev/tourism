import {colorScheme, createStyles} from '@/core/utils'

export const styles = createStyles({
  root: theme => ({
    borderRadius: '18px',
    backgroundColor: colorScheme(theme).background.card,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    border: `1px solid ${colorScheme(theme).background.card}`,
  }),
  rating: {
    margin: '16px 0 8px',
  },
  name: {
    fontWeight: 700,
    lineHeight: '24px',
  },
  text: {
    fontSize: '16px',
    lineHeight: '21px',
  },
  date: {
    fontSize: '12px',
    margin: '2px 0 12px',
    opacity: 0.4,
  },
})
