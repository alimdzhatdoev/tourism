import {colorScheme, createStyles} from '@/core/utils'
import {APP_FONTS} from '@/ui/themes/baseTheme'

export const styles = createStyles({
  root: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 1.61,
    objectFit: 'cover',
  },
  childrenContainer: t => ({
    position: 'absolute',
    width: 'calc(100% - 60px)',
    height: 'calc(100% - 60px)',
    margin: '31px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    gap: '24px',
    [t.breakpoints.down('lg')]: {
      width: 'calc(100% - 30px)',
      height: 'calc(100% - 30px)',
      margin: '15px',
      gap: '12px',
    },
  }),
  name: t => ({
    color: colorScheme(t).background.root,
    fontFamily: APP_FONTS.oswald,
    textTransform: 'uppercase',
    fontSize: '36px',
    lineHeight: '38px',
    fontWeight: 500,
    [t.breakpoints.down('lg')]: {
      fontSize: '16px',
      lineHeight: '24px',
    },
  }),
  moreButton: t => ({
    backgroundColor: colorScheme(t).background.root,
    fontSize: '16px',
    padding: '18px 50px',
    borderRadius: 9999,
    [t.breakpoints.down('lg')]: {
      fontSize: '8px',
      padding: '9px 25px',
    },
  }),
  specWrapper: t => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    margin: '-5px 0 10px',
    justifyContent: 'space-between',
    [t.breakpoints.down('lg')]: {
      margin: '0 0 10px',
      // justifyContent: 'center',
    },
  }),
  specContainer: t => ({
    display: 'flex',
    flexDirection: 'row',
    color: colorScheme(t).background.cardSecondary,
    '& svg': {
      fontSize: '30px',
    },
    alignItems: 'center',
    borderRadius: 9999,
    gap: '7px',
    [t.breakpoints.down('lg')]: {
      '& svg': {
        fontSize: '20px',
      },
      gap: '5px',
    },
  }),
  specTextContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  specLabel: t => ({
    fontSize: '10px',
    fontWeight: 700,

    textTransform: 'uppercase',
    [t.breakpoints.down('lg')]: {
      fontSize: '7px',
    },
  }),
  specValue: t => ({
    fontWeight: 700,
    lineHeight: '15px',
    fontSize: '15px',
    [t.breakpoints.down('lg')]: {
      lineHeight: '12px',
      fontSize: '12px',
    },
  }),
})
