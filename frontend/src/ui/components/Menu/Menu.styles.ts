import {colorScheme, createStyles, rootStyle, textEllipsis} from '@/core/utils'
import {layers} from '@/constants'

export const styles = createStyles({
  root: theme => ({
    ...rootStyle(theme),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '24px',
    padding: 0,
    [theme.breakpoints.down('lg')]: {
      justifyContent: 'space-around',
      position: 'fixed',
      bottom: 0,
      zIndex: layers.mobileMenu,
      backgroundColor: 'white',
      margin: 'unset',
      padding: '12px 10px 6px',
      borderTop: '0.5px solid lightgray',
      gap: 0,
    },
  }),
  menuItem: t => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    alignItems: 'center',
    fontWeight: 700,
    width: '86px',
    [t.breakpoints.down('lg')]: {
      width: '60px',
      gap: '2px',
      '& svg': {
        width: '30px',
        height: '30px',
      },
    },
  }),
  menuItemTitle: t => ({
    ...textEllipsis({numberOfLines: 2}),
    fontWeight: 'inherit',
    textAlign: 'center',
    [t.breakpoints.down('lg')]: {
      color: colorScheme(t).background.routePointPosition,
      fontSize: '12px',
      fontWeight: 500,
    },
  }),
})
