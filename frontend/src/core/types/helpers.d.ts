declare module 'types-helpers' {
  export type Nullable<T = unknown> = T | null

  export type Optional<T = unknown> = T | undefined

  type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>
  }

  export type ArrayValues<T extends readonly any[]> = T[number]

  export type Expand<T = Array<string>> = Partial<
    Record<ArrayValues<T>, boolean>
  >
}
