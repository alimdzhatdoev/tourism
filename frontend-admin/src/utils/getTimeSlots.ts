import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export const getTimeSlots = (timeInterval: number): string[] => {
  const timeSlots = [];
  let startTime = dayjs('00:00', 'HH:mm');
  let endTime = dayjs('24:00', 'HH:mm');

  while (startTime < endTime) {
    timeSlots.push(startTime.format('HH:mm'));
    startTime = startTime.add(timeInterval, 'minutes');
  }
  return timeSlots;
};
