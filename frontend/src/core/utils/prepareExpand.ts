import {Expand} from 'types-helpers'

export const prepareExpand = (expand?: Expand) => {
  if (!expand) return undefined
  return Object.entries(expand)
    .filter(([_, value]) => value)
    .map(([key]) => key)
    .join(',')
}
