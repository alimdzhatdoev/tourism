/**
 * @param phone +79999999999
 * @returns +7 (999) 999-9999
 */

export const maskPhone = (phone: string) =>
  phone.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4')

/**
 * @param phone +7 (999) 999-9999
 * @returns +79999999999
 */

export const unmaskPhone = (phone: string) => phone.replace(/[^+\d]/g, '')
