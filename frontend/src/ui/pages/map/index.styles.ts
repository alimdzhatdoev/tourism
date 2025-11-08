import {createStyles} from '@/core/utils'

export const styles = createStyles({
  textContent: t => ({
    textAlign: 'center',
    maxWidth: '1025px',
    fontSize: '20px',
    [t.breakpoints.down('lg')]: {
      textAlign: 'left',
      padding: '0 16px',
      fontSize: '16px',
    },
  }),
})
