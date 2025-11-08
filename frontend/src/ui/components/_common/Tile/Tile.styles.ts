import {createStyles} from '@/core/utils'

export const styles = createStyles({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  clickableRoot: {
    cursor: 'pointer',
  },
  image: {},
  disableImageMargin: t => ({
    margin: '0 0 16px',
    maxWidth: '100%',
    borderRadius: 'unset',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    [t.breakpoints.down('lg')]: {
      margin: '0 0 10px',
      maxWidth: '100%',
    },
  }),
  childrenContainer: {},
})
