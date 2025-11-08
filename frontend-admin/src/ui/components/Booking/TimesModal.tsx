import React, { useContext, useEffect, useState } from 'react';
import { Dialog } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { LocalButton } from '@app/ui/components/LocalButton';
import { toast } from 'react-toastify';
import { ExcursionDate, ExcursionTime } from '@app/core/models';
import { useLazyGetExcursionDateQuery } from '@app/core/store/excursion_dates';
import { BookingContext } from '.';
import { UseBookingReturnType } from '@app/hooks/useBooking';
import cn from 'classnames';

interface TimesModalProps {
  open: boolean;
  closeModal: () => void;
  excursionDateId: ExcursionDate['id'];
}

const TimesModal: React.FC<TimesModalProps> = ({
  open,
  closeModal,
  excursionDateId,
}) => {
  const [{ selectedTime }, { setSelectedTime }] = useContext(
    BookingContext,
  ) as UseBookingReturnType;

  const [selected, setSelected] = useState<ExcursionTime | null>(selectedTime);

  const [loadExcursionDateApi, { data, isError }] =
    useLazyGetExcursionDateQuery();

  const excursionTimes = data ? data.data.times : [];

  useEffect(() => {
    if (open) {
      loadExcursionDateApi({
        id: excursionDateId,
        expand: ['times'],
      });
    }
  }, [open, excursionDateId, loadExcursionDateApi]);

  if (isError) toast.error('Ошибка загрузки доступного времени');

  const handleSaveClick = () => {
    setSelectedTime(selected);
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
      <div className="flex flex-col justify-center align-center w-[600px] p-5">
        <LocalButton
          className="self-end mb-2"
          variant="text"
          onClick={closeModal}
        >
          <CloseIcon sx={{ color: 'black' }} fontSize="medium" />
        </LocalButton>
        <span className="text-2xl mx-5 text-center">Выберите доступное время</span>
        <div className="flex flex-1 flex-wrap justify-center gap-5 my-10">
          {excursionTimes.length &&
            excursionTimes.map(time => (
              <button
                key={time.id}
                onClick={() => setSelected(time)}
                className={cn('border p-5 rounded-xl hover:border-menu_dark', {
                  'bg-menu_dark text-white border-menu_dark':
                    selected && time.id === selected.id,
                })}
              >
                {time.time}
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

export default TimesModal;
