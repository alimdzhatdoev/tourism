import {colorScheme, createStyles} from '@/core/utils'

export const styles = createStyles({
  root: {
    display: 'flex',
    // gap: '6px',
    alignItems: 'center',
    '& svg': {
      fontSize: '24px',
    },
  },
  star: theme => ({
    fontSize: '24px',
    color: colorScheme(theme).background.ratingStar,
  }),
  reviewsCount: theme => ({
    fontSize: '16px',
    // lineHeight: '16px',
    color: colorScheme(theme).text.dimmed,
    maxHeight: 'fit-content',
    marginLeft: '8px',
  }),
})
