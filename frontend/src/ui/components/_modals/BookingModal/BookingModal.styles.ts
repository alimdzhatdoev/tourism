import {colorScheme, createStyles} from '@/core/utils'

export const styles = createStyles({
  blockRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
    margin: '24px 0 0',
  },
  blockTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 700,
    fontSize: '20px',
    lineHeight: '24px',
  },
  blockTextWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    lineHeight: '18px',
  },
  blockText: {
    fontWeight: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
  },
  calendar: t => ({
    backgroundColor: colorScheme(t).background.card,
    borderRadius: '18px',
    '& .Mui-selected': {
      backgroundColor:
        colorScheme(t).background.routePointPosition + ' !important',
    },
  }),
  dateTimeContainer: t => ({
    display: 'flex',
    gap: '25px',
    margin: '8px 0 0',
    [t.breakpoints.down('lg')]: {
      flexDirection: 'column',
    },
  }),
  timesList: t => ({
    width: '77px',
    height: '334px',
    border: '1px solid red',
    [t.breakpoints.down('lg')]: {
      width: '320px',
      height: '40px',
    },
  }),
  timeButton: t => ({
    flex: 1,
    padding: '8px 16px',
    fontSize: '16px',
    backgroundColor: colorScheme(t).background.routePointPosition,
    '&:hover': {
      backgroundColor: colorScheme(t).background.routePointPosition,
    },
  }),
  timeButtonNotSelected: t => ({
    backgroundColor: colorScheme(t).background.card,
    color: colorScheme(t).text.dimmed,
    '&:hover': {
      backgroundColor: colorScheme(t).background.card,
    },
  }),
  visitorsConut: t => ({
    fontSize: '14px',
    lineHeight: '18px',
    color: colorScheme(t).text.dimmed,
  }),
  payButton: {
    margin: '24px 0 0',
  },
})
