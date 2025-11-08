import {Nullable} from 'types-helpers'

export const capitalizeFirstLetter = (str: Nullable<string | undefined>) => {
  if (!str?.length) return ''

  const firstLetter = str.slice(0, 1)

  return firstLetter.toUpperCase() + str.slice(1)
}
