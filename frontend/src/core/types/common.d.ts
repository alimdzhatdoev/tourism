declare module 'types-common' {
  import {FC} from 'react'

  export type TRoute = {
    path: string | string[]
    Component: FC
    isPrivate?: boolean
    redirectPath?: string
  }

  export type TLink = {
    title: string
    path: string
    search?: string
  }

  export type Tokens = {
    access: string
    refresh: string
  }
}
