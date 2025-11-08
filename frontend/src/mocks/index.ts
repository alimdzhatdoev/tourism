export const api = <T extends {id: number}>(
  id: number,
  items: Array<T>,
): T | undefined => {
  return items.find(i => i.id === id)
}
