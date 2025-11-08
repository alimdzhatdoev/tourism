type Formats = 'full' | 'time' | 'date' | 'timeDate';

export const dateTimeFormats: Record<Formats, string> = {
  full: 'DD MMMM YYYYг. в HH:mm',
  date: 'DD.MM.YYYY',
  time: 'HH:mm',
  timeDate: 'HH:mm D MMMM YYYY',
};
