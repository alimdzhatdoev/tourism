import {colorScheme, createStyles, rootStyle} from '@core/utils'

export const DESKTOP_BANNER_HEIGHT = 600
export const MOBILE_BANNER_HEIGHT = 300

export const styles = createStyles({
  root: theme => ({
    ...rootStyle(theme),
    position: 'realtive',
    marginTop: '24px',
    [theme.breakpoints.down('lg')]: {
      marginTop: 'unset',
    },
    '& .swiper-pagination': {
      bottom: '28px',
      [theme.breakpoints.down('lg')]: {
        bottom: '18px',
      },
    },
    '& .swiper-pagination-bullet': {
      width: '16px',
      height: '16px',
      borderRadius: 9999,
      opacity: 0.8,
      backgroundColor: colorScheme(theme).background.swiperPagination,
      [theme.breakpoints.down('lg')]: {
        width: '10px',
        height: '10px',
      },
    },
    '& .swiper-pagination-bullet-active': {
      background: colorScheme(theme).background.swiperPaginationActive,
    },
  }),
  slide: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: theme => ({
    borderRadius: '24px',
    width: '100%',
    height: `${DESKTOP_BANNER_HEIGHT}px`,
    [theme.breakpoints.down('lg')]: {
      borderRadius: 'unset',
      height: `${MOBILE_BANNER_HEIGHT}px`,
    },
  }),
  skeleton: theme => ({
    height: `${DESKTOP_BANNER_HEIGHT}px`,
    display: 'flex',
    borderRadius: '24px',
    [theme.breakpoints.down('lg')]: {
      borderRadius: 'unset',
      height: `${MOBILE_BANNER_HEIGHT}px`,
    },
  }),
  textContainer: theme => ({
    position: 'absolute',
    padding: '24px',
    zIndex: 10,
    color: colorScheme(theme).text.contrast,
    textAlign: 'center',
  }),
  title: theme => ({
    fontSize: '40px',
    fontWeight: 700,
    textTransform: 'uppercase',
    [theme.breakpoints.down('lg')]: {
      fontSize: '30px',
    },
  }),
  subtitle: theme => ({
    fontSize: '36px',
    fontWeight: 600,
    [theme.breakpoints.down('lg')]: {
      fontSize: '26px',
    },
  }),
})
