interface HandleErrorOptions {
  log: boolean
}

const DEFAULT_OPTIONS: Partial<HandleErrorOptions> = {
  log: true,
}

export const handleError = <T = unknown>(
  error: T,
  options?: Partial<HandleErrorOptions>,
) => {
  if (options?.log ?? DEFAULT_OPTIONS.log) {
    console.error(error)
  }
}
