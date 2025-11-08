import {colorScheme, createStyles, textEllipsis} from '@/core/utils'

const DESKTOP_IMAGE_SIZE = 124
const MOBILE_IMAGE_SIZE = 100

export const styles = createStyles({
  root: {
    position: 'relative',
    alignItems: 'center',
    backgroundColor: 'unset',
  },
  image: t => ({
    borderRadius: '24px',
    margin: '0 8px 16px',
    width: '100%',
    height: '100%',
    maxWidth: `${DESKTOP_IMAGE_SIZE}px`,
    maxHeight: `${DESKTOP_IMAGE_SIZE}px`,
    [t.breakpoints.down('lg')]: {
      margin: '0 8px 10px',
      maxWidth: `${MOBILE_IMAGE_SIZE}px`,
      maxHeight: `${MOBILE_IMAGE_SIZE}px`,
    },
  }),
  position: t => ({
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 'auto',
    minWidth: '24px',
    maxWidth: 'fit-content',
    fontSize: '16px',
    borderRadius: 9999,
    backgroundColor: colorScheme(t).background.routePointPosition,
    color: colorScheme(t).text.contrast,
    textAlign: 'center',
    right: `-${DESKTOP_IMAGE_SIZE}px`,
    [t.breakpoints.down('lg')]: {
      right: `-${MOBILE_IMAGE_SIZE}px`,
    },
  }),
  name: t => ({
    fontSize: '16px',
    lineHeight: '20px',
    textAlign: 'center',
    ...textEllipsis({numberOfLines: 2}),
    [t.breakpoints.down('lg')]: {
      fontSize: '12px',
      lineHeight: '14px',
    },
  }),
  childrenContainer: t => ({
    maxWidth: 'fit-content',
    height: '100%',
    borderRadius: 9999,
    backgroundColor: colorScheme(t).background.routePointPosition,
    color: colorScheme(t).text.contrast,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    padding: '10px 16px',
    [t.breakpoints.down('lg')]: {
      padding: '6px 12px',
    },
  }),
})
