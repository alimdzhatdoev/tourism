import React from 'react'

/**
 * Usage:
 * ```tsx
 * <div ref={mergeRefs(ref1, ref2, ref3)} />
 * ```
 */
export const mergeRefs = <T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.Ref<T> | React.RefCallback<T> => {
  const filteredRefs = refs.filter(Boolean)

  if (filteredRefs.length <= 1) {
    const firstRef = filteredRefs[0]
    return firstRef || null
  }

  return function mergedRefs(ref) {
    filteredRefs.forEach(r => {
      if (typeof r === 'function') {
        r(ref)
      } else if (r) {
        ;(r as React.MutableRefObject<T | null>).current = ref
      }
    })
  }
}
