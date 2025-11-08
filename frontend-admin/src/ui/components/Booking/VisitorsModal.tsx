import React, { useContext, useState } from 'react';
import { Dialog } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { LocalButton } from '@app/ui/components/LocalButton';
import { MIN_VISITORS, UseBookingReturnType } from '@app/hooks/useBooking';
import { BookingContext } from '.';

interface VisitorsModalProps {
  open: boolean;
  closeModal: () => void;
  maxVisitors: number;
}

const VisitorsModal: React.FC<VisitorsModalProps> = ({
  open,
  closeModal,
  maxVisitors,
}) => {
  const [{ selectedVisitors }, { setSelectedVisitors }] = useContext(
    BookingContext,
  ) as UseBookingReturnType;

  const [selected, setSelected] = useState<number>(selectedVisitors);

  const handleSaveClick = () => {
    setSelectedVisitors(selected);
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
      <div className="flex flex-col justify-center align-center p-5">
        <LocalButton
          className="self-end mb-2"
          variant="text"
          onClick={closeModal}
        >
          <CloseIcon sx={{ color: 'black' }} fontSize="medium" />
        </LocalButton>
        <span className="text-2xl text-center mx-5">
          Количество посетителей
        </span>
        <div className="flex flex-1 flex-wrap justify-center items-center gap-5 my-5">
          <button
            onClick={() =>
              setSelected(prev => (prev > MIN_VISITORS ? prev - 1 : prev))
            }
            className="border p-5 rounded-xl hover:border-menu_dark"
          >
            -
          </button>
          <span>{selected}</span>
          <button
            onClick={() =>
              setSelected(prev => (prev < maxVisitors ? prev + 1 : prev))
            }
            className="border p-5 rounded-xl hover:border-menu_dark"
          >
            +
          </button>
        </div>
        <div className="flex flex-row justify-center w-full mt-4">
          <LocalButton onClick={handleSaveClick}>Сохранить</LocalButton>
        </div>
      </div>
    </Dialog>
  );
};

export default VisitorsModal;
