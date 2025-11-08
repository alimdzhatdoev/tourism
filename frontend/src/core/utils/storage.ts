import {Tokens} from 'types-common'
import {Nullable} from 'types-helpers'

interface Storage {
  tokens: Tokens
}

type StorageNames = keyof Storage

export const appStorage = () => {
  const write = <K extends StorageNames>(key: K, value: Storage[K]) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const read = <K extends StorageNames>(
    key: K,
    formatter?: (value: Storage[K]) => any,
  ): Nullable<Storage[K]> => {
    try {
      const value = localStorage.getItem(key)
      if (value) {
        return formatter
          ? formatter(JSON.parse(value))
          : (JSON.parse(value) as Storage[K])
      } else {
        return null
      }
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const remove = <K extends StorageNames>(key: K) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const clear = () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  return {write, read, remove, clear}
}
