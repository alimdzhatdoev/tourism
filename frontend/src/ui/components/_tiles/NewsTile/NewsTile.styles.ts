import {createStyles, colorScheme} from '@/core/utils'

const IMAGE_RATIO = 0.86

export const styles = createStyles({
  root: {
    borderRadius: '21px',
  },
  textContainer: {},
  date: t => ({
    color: colorScheme(t).text.dimmed,
    fontSize: '16px',
    [t.breakpoints.down('lg')]: {
      fontSize: '14px',
    },
  }),
  heading: t => ({
    fontSize: '25px',
    lineHeight: '37px',
    fontWeight: 500,
    textTransform: 'uppercase',
    [t.breakpoints.down('lg')]: {
      fontSize: '14px',
      lineHeight: '20px',
    },
  }),
  text: {},
  button: {},
  image: t => ({
    width: '100%',
    aspectRatio: IMAGE_RATIO,
    objectFit: 'cover',
    borderTopLeftRadius: '21px',
    borderTopRightRadius: '21px',
    [t.breakpoints.down('lg')]: {},
  }),
  childrenContainer: t => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '18px 40px 30px',
    border: `1px solid ${colorScheme(t).border.tile}`,
    borderBottomLeftRadius: '21px',
    borderBottomRightRadius: '21px',
    borderTop: 'none',
    [t.breakpoints.down('lg')]: {
      padding: '20px',
    },
  }),
})
