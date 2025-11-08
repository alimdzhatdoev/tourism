import { useEffect, useState } from 'react';
import {
  Attraction,
  ExcursionBooking,
  ExcursionDate,
  ExcursionTime,
} from '@app/core/models';
import { useIsMount } from '@app/hooks';

export const MIN_VISITORS = 1;

interface UseBookingProps {
  attraction: Attraction;
  excursionDate: ExcursionDate;
  excursionTime: ExcursionTime;
  visitors: ExcursionBooking['visitors'];
}

export const useBooking = ({
  attraction,
  excursionDate,
  excursionTime,
  visitors,
}: UseBookingProps) => {
  const [selectedAttraction, setSelectedAttraction] =
    useState<Attraction>(attraction);
  const [selectedDate, setSelectedDate] = useState<ExcursionDate | null>(
    excursionDate,
  );
  const [selectedTime, setSelectedTime] = useState<ExcursionTime | null>(
    excursionTime,
  );
  const [selectedVisitors, setSelectedVisitors] =
    useState<ExcursionBooking['visitors']>(visitors);

  const isMount = useIsMount();

  useEffect(() => {
    if (!isMount) {
      setSelectedDate(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttraction]);

  useEffect(() => {
    if (!isMount) {
      setSelectedTime(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  useEffect(() => {
    if (!isMount) {
      setSelectedVisitors(MIN_VISITORS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTime]);

  return [
    { selectedAttraction, selectedDate, selectedTime, selectedVisitors },
    {
      setSelectedAttraction,
      setSelectedDate,
      setSelectedTime,
      setSelectedVisitors,
    },
  ] as const;
};

export type UseBookingReturnType = ReturnType<typeof useBooking>;
