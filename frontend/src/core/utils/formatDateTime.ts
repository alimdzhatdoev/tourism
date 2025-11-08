export const formatDateTime = {
  /**
   * @default '/'
   * @example dateTimeFormats.date() => 'DD/MM/YYYY'
   */
  date: (separator: string = '/') => ['DD', 'MM', 'YYYY'].join(separator),
  /**
   * @default ':'
   * @example dateTimeFormats.time() => 'HH:mm'
   */
  time: (separator: string = ':') => ['HH', 'mm'].join(separator),
  /**
   * @example 'Четверг, 15 июня'
   */
  weekdayAndDate: 'dddd, D MMMM',
  /**
   * @example '15 июня'
   */
  dateWithMonth: 'D MMMM',
}
