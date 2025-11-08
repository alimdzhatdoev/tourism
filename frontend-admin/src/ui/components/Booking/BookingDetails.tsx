import React, { useContext, useMemo } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { BookingContext } from '.';
import { UseBookingReturnType } from '@app/hooks/useBooking';
import { ExcursionBooking } from '@app/core/models';
import { LocalButton } from '@app/ui/components/LocalButton';
import { dateTimeFormats } from '@app/constants';
import dayjs from 'dayjs';

interface BookingDetailsProps {
  createdBy: ExcursionBooking['createdBy'];
  createdDttm: ExcursionBooking['createdDttm'];
  comment: ExcursionBooking['comment'];
  onEditAttractionClick: () => void;
  onEditExcursionDateClick: () => void;
  onEditExcursionTimeClick: () => void;
  onEditVisitorsClick: () => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({
  createdBy,
  createdDttm,
  comment,
  onEditAttractionClick,
  onEditExcursionDateClick,
  onEditExcursionTimeClick,
  onEditVisitorsClick,
}) => {
  const [{ selectedAttraction, selectedDate, selectedTime, selectedVisitors }] =
    useContext(BookingContext) as UseBookingReturnType;

  const userFullName = createdBy.fullName;
  const createdDtm = dayjs(createdDttm).format(dateTimeFormats.dateTime);

  const { name } = selectedAttraction;

  const date = selectedDate
    ? dayjs(selectedDate.date).format(dateTimeFormats.date)
    : 'Не выбрано';

  const time = useMemo(() => {
    if (!selectedDate) {
      return 'Выберите дату';
    }
    if (!selectedTime) {
      return 'Не выбрано';
    }
    return dayjs(selectedDate.date + selectedTime.time).format(
      dateTimeFormats.time,
    );
  }, [selectedDate, selectedTime]);

  const visitors = useMemo(() => {
    if (!selectedDate) {
      return 'Выберите дату';
    }
    if (!selectedTime) {
      return 'Выберите время';
    }
    return `${selectedVisitors} чел.`;
  }, [selectedDate, selectedTime, selectedVisitors]);

  const total = useMemo(() => {
    if (!selectedDate) {
      return 'Выберите дату';
    }
    if (!selectedTime) {
      return 'Выберите время';
    }
    return `${selectedTime.price} ₽ x ${selectedVisitors} чел. = ${
      selectedVisitors * selectedTime.price
    } ₽`;
  }, [selectedDate, selectedTime, selectedVisitors]);

  return (
    <div className="bg-gray-100 p-7 rounded-lg">
      <div className="flex flex-row items-center h-[70px]">
        <span className="w-1/6">Пользователь</span>
        <span className="text-xl">{userFullName}</span>
      </div>
      <div className="flex flex-row items-center border-t border-neutral-300 h-[70px]">
        <span className="w-1/6">Дата размещения</span>
        <span className="text-xl">{createdDtm}</span>
      </div>
      <div className="flex flex-row items-center border-t border-neutral-300 h-[70px]">
        <span className="w-1/6">Комментарий</span>
        <span className="text-xl">{comment}</span>
      </div>
      <div className="flex flex-row items-center border-t border-neutral-300 hover:bg-gray-200 h-[70px]">
        <span className="w-1/6">Объект</span>
        <div className="flex flex-row items-center justify-between flex-1">
          <span className="text-xl">{name}</span>
          <LocalButton
            asIcon
            variant="contained"
            className="w-10 h-10 ml-5"
            onClick={onEditAttractionClick}
          >
            <EditIcon sx={{ color: 'white' }} />
          </LocalButton>
        </div>
      </div>
      <div className="flex flex-row items-center border-t border-neutral-300 hover:bg-gray-200 h-[70px]">
        <span className="w-1/6">Дата бронирования</span>
        <div className="flex flex-row items-center justify-between flex-1">
          <span className="text-xl">{date}</span>
          <LocalButton
            asIcon
            variant="contained"
            className="w-10 h-10 ml-5"
            onClick={onEditExcursionDateClick}
          >
            <EditIcon sx={{ color: 'white' }} />
          </LocalButton>
        </div>
      </div>
      <div className="flex flex-row items-center border-t border-neutral-300 hover:bg-gray-200 h-[70px]">
        <span className="w-1/6">Время бронирования</span>
        <div className="flex flex-row items-center justify-between flex-1">
          <span className="text-xl">{time}</span>
          {selectedDate && (
            <LocalButton
              asIcon
              variant="contained"
              className="w-10 h-10 ml-5"
              onClick={onEditExcursionTimeClick}
            >
              <EditIcon sx={{ color: 'white' }} />
            </LocalButton>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center border-t border-neutral-300 hover:bg-gray-200 h-[70px]">
        <span className="w-1/6">Количество</span>
        <div className="flex flex-row items-center justify-between flex-1">
          <span className="text-xl">{visitors}</span>
          {selectedTime && (
            <LocalButton
              asIcon
              variant="contained"
              className="w-10 h-10 ml-5"
              onClick={onEditVisitorsClick}
            >
              <EditIcon sx={{ color: 'white' }} />
            </LocalButton>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center border-t border-neutral-300 h-[70px]">
        <span className="w-1/6">Итоговая сумма</span>
        <span className="text-xl">{total}</span>
      </div>
    </div>
  );
};

export default BookingDetails;
