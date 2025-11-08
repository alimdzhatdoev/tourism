import {createStyles} from '@/core/utils'

export const styles = createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  swiper: {
    display: 'flex',
    flex: 1,
  },
  swiperSlide: {
    display: 'flex',
    height: 'auto',
  },
  skeleton: {
    flex: 1,
    width: '100%',
  },
  navigationContainer: {
    display: 'flex',
    gap: '20px',
    marginTop: '56px',
  },
  navigationButton: t => ({
    height: '80px',
    aspectRatio: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid currentColor',
    '& svg': {
      fontSize: '30px',
    },
    [t.breakpoints.down('lg')]: {
      display: 'none',
    },
  }),
})
