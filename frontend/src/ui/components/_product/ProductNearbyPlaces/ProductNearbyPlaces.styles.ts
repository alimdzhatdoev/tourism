import {createStyles, rootStyle} from '@/core/utils'

export const styles = createStyles({
  root: theme => ({
    ...rootStyle(theme),
    display: 'flex',
    flexDirection: 'column',
    gap: '56px',
  }),
  headerContainer: {},
  headerTitle: {
    textAlign: 'left',
  },
})
