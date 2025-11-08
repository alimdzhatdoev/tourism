import {createStyles, rootStyle, textEllipsis} from '@/core/utils'
import {hideScrollbar} from '@/core/utils/sx'

export const styles = createStyles({
  root: t => ({
    ...rootStyle(t),
    padding: 0,
    [t.breakpoints.down('lg')]: {
      px: 0,
    },
  }),
  itemsContainer: t => ({
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    overflowX: 'scroll',
    ...hideScrollbar(),
    [t.breakpoints.down('lg')]: {
      px: '16px',
    },
  }),
  item: {
    width: '100%',
    maxWidth: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
  },
  menuItemTitle: {
    ...textEllipsis({numberOfLines: 2}),
    fontWeight: 'inherit',
    textAlign: 'center',
    justifySelf: 'flex-end',
    width: '100px',
  },
})
