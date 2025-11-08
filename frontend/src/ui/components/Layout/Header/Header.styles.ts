import {colors} from '@/constants'
import {createStyles, colorScheme, px} from '@core/utils'
import {alpha} from '@mui/material'

export const HEADER_HEIGHT = {
  static: 82,
  sticky: 80,
}

export const styles = createStyles({
  staticRoot: {
    transition: 'all 100ms ease-in',
    backgroundColor: t => colorScheme(t).background.root,
    height: px(HEADER_HEIGHT.static),
    zIndex: 90,
    padding: '0 20px',
  },
  staticLogoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '12px',
    fontSize: '16px !important',
  },
  transparentPath: {
    color: t => colorScheme(t).text.contrast + '! important',
  },
  socialLink: {
    width: '44px',
    aspectRatio: 1,
    borderRadius: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px 2px 0 0',
    backgroundColor: t => alpha(colorScheme(t).text.primary, 0.1),
  },
  stickyRoot: t => ({
    top: 0,
    position: 'sticky',
    alignItems: 'center',
    zIndex: 90,
    height: px(HEADER_HEIGHT.sticky),
    transition: 'all 100ms ease-in',
    backgroundColor: colorScheme(t).background.root,
    boxShadow: '0px 4px 46.4px 0px #B4B4B440',
    padding: '15px 20px',
    color: colors.light.primary.update1,
    [t.breakpoints.down('lg')]: {
      padding: '16px 30px',
    },
  }),
  menuIcon: {
    fontSize: '30px',
  },
})
