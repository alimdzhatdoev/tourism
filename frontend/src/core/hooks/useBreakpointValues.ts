import {Breakpoint} from '@mui/material'
import {useEffect, useState} from 'react'
import {useBreakpointName} from '.'

export const useBreakpointValues = <T = unknown>(
  initialValue: T,
  config: Partial<{[key in Breakpoint]: T} & {initialBreakpoint: Breakpoint}>,
) => {
  const [value, setValue] = useState<T>(initialValue)
  const breakpoint = useBreakpointName(config.initialBreakpoint)

  useEffect(() => {
    const currentValue = config[breakpoint]
    if (currentValue) setValue(currentValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakpoint])

  return {value, breakpoint}
}
