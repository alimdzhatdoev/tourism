import React, { useContext, useEffect, useState } from 'react';
import { Dialog } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { LocalButton } from '@app/ui/components/LocalButton';
import { useLazyGetExcursionQuery } from '@app/core/store/excursions';
import { ExcursionBooking, ExcursionDate } from '@app/core/models';
import { UseBookingReturnType } from '@app/hooks/useBooking';
import { BookingContext } from '.';
import { toast } from 'react-toastify';
import { dateTimeFormats } from '@app/constants';
import dayjs from 'dayjs';
import cn from 'classnames';

interface DatesModalProps {
  open: boolean;
  closeModal: () => void;
  excursionId: ExcursionBooking['id'];
}

const DatesModal: React.FC<DatesModalProps> = ({
  open,
  closeModal,
  excursionId,
}) => {
  const [{ selectedDate }, { setSelectedDate }] = useContext(
    BookingContext,
  ) as UseBookingReturnType;

  const [selected, setSelected] = useState<ExcursionDate | null>(selectedDate);

  const [loadExcursionApi, { data, isError }] = useLazyGetExcursionQuery();

  const excursionDates = data ? data.data.scheduleDates : [];

  useEffect(() => {
    if (open) {
      loadExcursionApi({
        id: excursionId,
        expand: ['schedule_dates'],
      });
    }
  }, [open, excursionId, loadExcursionApi]);

  if (isError) toast.error('Ошибка загрузки доступных дат');

  const handleSaveClick = () => {
    setSelectedDate(selected);
    closeModal();
  };

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      PaperProps={{
        style: {
          borderRadius: 24,
        },
      }}
      maxWidth="xl"
    >
      <div className="flex flex-col justify-center align-center w-[800px] p-5 relative">
        <LocalButton
          className="self-end mb-2"
          variant="text"
          onClick={closeModal}
        >
          <CloseIcon sx={{ color: 'black' }} fontSize="medium" />
        </LocalButton>
        <span className="text-3xl text-center">Выберите доступную дату</span>
        <div className="flex flex-1 flex-wrap justify-center gap-5 my-10">
          {excursionDates.length &&
            excursionDates.map(date => (
              <button
                key={date.id}
                onClick={() => setSelected(date)}
                className={cn('border p-5 rounded-xl hover:border-menu_dark', {
                  'bg-menu_dark text-white border-menu_dark':
                    selected && date.id === selected.id,
                })}
              >
                {dayjs(date.date).format(dateTimeFormats.date)}
              </button>
            ))}
        </div>
        <div className="flex flex-row justify-center w-full mt-4">
          <LocalButton onClick={handleSaveClick}>Сохранить</LocalButton>
        </div>
      </div>
    </Dialog>
  );
};

export default DatesModal;
