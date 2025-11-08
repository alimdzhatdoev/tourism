import React, { createContext, useState } from 'react';
import {
  Attraction,
  ExcursionBooking,
  ExcursionDate,
  ExcursionTime,
} from '@app/core/models';
import { useBooking, UseBookingReturnType } from '@app/hooks/useBooking';
import BookingDetails from './BookingDetails';
import AttractionsModal from './AttractionsModal';
import DatesModal from './DatesModal';
import TimesModal from './TimesModal';
import VisitorsModal from './VisitorsModal';
import { LocalButton } from '@app/ui/components/LocalButton';
import { useUpdateExcursionBookingMutation } from '@app/core/store/excursion_bookings';
import { toast } from 'react-toastify';

type ModalType = 'attractions' | 'dates' | 'times' | 'visitors' | null;

interface BookingProps {
  initialData: {
    id: ExcursionBooking['id'];
    createdBy: ExcursionBooking['createdBy'];
    createdDttm: ExcursionBooking['createdDttm'];
    comment: ExcursionBooking['comment'];
    visitors: ExcursionBooking['visitors'];
    attraction: Attraction;
    excursionDate: ExcursionDate;
    excursionTime: ExcursionTime;
  };
  onSave: () => void;
}

export const BookingContext = createContext<UseBookingReturnType | null>(null);

const Booking: React.FC<BookingProps> = ({
  initialData: {
    id,
    createdBy,
    createdDttm,
    comment,
    visitors,
    attraction,
    excursionDate,
    excursionTime,
  },
  onSave,
}) => {
  const [openModal, setOpenModal] = useState<ModalType>(null);

  const closeModal = () => setOpenModal(null);

  const [state, dispatch] = useBooking({
    attraction,
    excursionDate,
    excursionTime,
    visitors,
  });

  const { selectedAttraction, selectedDate, selectedTime, selectedVisitors } =
    state;

  const excursionId = selectedAttraction.excursions.length
    ? selectedAttraction.excursions[0].id
    : excursionDate.excursion.id;

  const [updateExcursionBookingApi, { isError: updateBookingError }] =
    useUpdateExcursionBookingMutation();

  const saveDisabled = !selectedDate || !selectedTime;

  const handleOnSaveClick = async () => {
    if (!saveDisabled) {
      await updateExcursionBookingApi({
        id,
        comment,
        excursion_time: selectedTime.id,
        visitors: selectedVisitors,
      });
      if (updateBookingError)
        return toast.error('Ошибка: не удалось сохранить бронирование');
      onSave();

      return toast.success('Бронирование сохранено!');
    }

    return updateBookingError;
  };

  return (
    <BookingContext.Provider value={[state, dispatch]}>
      <BookingDetails
        createdBy={createdBy}
        createdDttm={createdDttm}
        comment={comment}
        onEditAttractionClick={() => setOpenModal('attractions')}
        onEditExcursionDateClick={() => setOpenModal('dates')}
        onEditExcursionTimeClick={() => setOpenModal('times')}
        onEditVisitorsClick={() => setOpenModal('visitors')}
      />
      <AttractionsModal
        open={openModal === 'attractions'}
        closeModal={closeModal}
      />
      <DatesModal
        open={openModal === 'dates'}
        closeModal={closeModal}
        excursionId={excursionId}
      />
      {selectedDate && (
        <TimesModal
          open={openModal === 'times'}
          closeModal={closeModal}
          excursionDateId={selectedDate.id}
        />
      )}
      {selectedTime && (
        <VisitorsModal
          open={openModal === 'visitors'}
          closeModal={closeModal}
          maxVisitors={selectedTime.maxVisitors}
        />
      )}
      <div className="flex items-center justify-center pt-10">
        <LocalButton
          type="submit"
          onClick={handleOnSaveClick}
          disabled={saveDisabled}
        >
          Сохранить
        </LocalButton>
      </div>
    </BookingContext.Provider>
  );
};

export default Booking;
