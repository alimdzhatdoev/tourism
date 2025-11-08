import {colorScheme, createStyles} from '@core/utils'

export const styles = createStyles({
  root: t => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: colorScheme(t).background.root,
    zIndex: 1,
    position: 'relative',
  }),
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
})
