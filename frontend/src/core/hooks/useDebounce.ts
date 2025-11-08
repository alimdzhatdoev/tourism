import {useEffect, useState} from 'react'

export function useDebounce<T = string>(initialValue: T, delay: number = 600) {
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue)
  const [value, setValue] = useState<T>(initialValue)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return [debouncedValue, setValue, value] as const
}
