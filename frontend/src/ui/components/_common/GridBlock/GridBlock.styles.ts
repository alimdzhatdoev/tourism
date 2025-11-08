import {createStyles} from '@/core/utils'

export const styles = createStyles({
  root: theme => ({
    display: 'grid',
    rowGap: '42px',
    columnGap: '20px',
    overflow: 'hidden',
    [theme.breakpoints.down('lg')]: {
      rowGap: '20px',
    },
  }),
})
