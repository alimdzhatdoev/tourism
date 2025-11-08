import {Breakpoint, useMediaQuery, useTheme} from '@mui/material'
import {useMemo} from 'react'

const DEFAULT_INITIAL_BREAKPOINT: Breakpoint = 'lg'

export const useBreakpointName = (
  initialBreakpoint: Breakpoint = DEFAULT_INITIAL_BREAKPOINT,
) => {
  const theme = useTheme()

  const mq_xs = useMediaQuery(theme.breakpoints.only('xs'))
  const mq_sm = useMediaQuery(theme.breakpoints.only('sm'))
  const mq_md = useMediaQuery(theme.breakpoints.only('md'))
  const mq_lg = useMediaQuery(theme.breakpoints.only('lg'))
  const mq_xl = useMediaQuery(theme.breakpoints.only('xl'))

  const breakpoint = useMemo(() => {
    if (mq_xs) {
      return 'xs'
    }
    if (mq_sm) {
      return 'sm'
    }
    if (mq_md) {
      return 'md'
    }
    if (mq_lg) {
      return 'lg'
    }
    if (mq_xl) {
      return 'xl'
    }
    return initialBreakpoint
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mq_lg, mq_md, mq_sm, mq_xl, mq_xs])

  return breakpoint
}
