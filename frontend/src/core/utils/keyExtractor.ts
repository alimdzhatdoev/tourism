import {Key} from 'react'

export const keyExtractor = <T extends unknown>(listItem: T): Key => {
  if ('id' in (listItem as {})) {
    return (listItem as {id: Key}).id
  }
  return JSON.stringify(listItem) + new Date().getTime() + Math.random()
}
