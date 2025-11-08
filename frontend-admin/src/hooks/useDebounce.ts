import { useEffect, useState } from 'react';

export function useDebounce<T = string>(value: T, delay: number = 600): T {
  const [debouncedValue, setDebouncedValue] = useState<typeof value>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
