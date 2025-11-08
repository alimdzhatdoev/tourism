type NounEndingsVariants = {
  one: string
  few: string
  many: string
}

/**
 * @param {number} count - number of entities
 * @param {string} name  - string value to be converted
 * @param {NounEndingsVariants} variants - noun endings variants.
 * Empty ending must be presented as empty string
 * @param {boolean} showsZero - shows zero value or replace to string.
 *
 * @returns {string} declension converted value
 *
 * @example
 * ```
 * pluralize(1, 'заказ', { one: '', few: 'а', many: 'ов' }) // '1 заказ'
 * pluralize(3, 'заказ', { one: '', few: 'а', many: 'ов' }) // '3 заказа'
 * pluralize(0, 'заказ', { one: '', few: 'а', many: 'ов' }) // 'Нет заказов'
 * pluralize(0, 'заказ', { one: '', few: 'а', many: 'ов' }, true) // '0 заказов'
 * ```
 */
export const pluralize = (
  count: number | undefined,
  name: string,
  variants: NounEndingsVariants,
  showsZero: boolean = false,
): string => {
  const {few, many, one} = variants
  if (!count || Number.isNaN(count)) {
    return showsZero ? `0 ${name}${many}` : `Нет ${name}${many}`
  }
  const num = Math.abs(count)
  const remainder = num % 10
  if (num > 10 && num < 20) return `${count} ${name}${many}`
  if (remainder > 1 && remainder < 5) return `${count} ${name}${few}`
  if (remainder === 1) return `${count} ${name}${one}`
  return `${count} ${name}${many}`
}
