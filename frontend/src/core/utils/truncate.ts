const DEFAULT_SUFFIX = '...'

export const truncate = (
  string = '',
  options: {length: number; suffix?: string; sentenceEnd?: boolean},
) => {
  if (string.length > options.length) {
    const sliced = string.slice(0, options.length)
    const suffix = options.suffix ?? DEFAULT_SUFFIX
    if (options?.sentenceEnd) {
      const lastDotIndex = sliced.lastIndexOf('. ')
      return sliced.slice(0, lastDotIndex + 1) + suffix
    }
    return sliced + suffix
  } else {
    return string
  }
}
