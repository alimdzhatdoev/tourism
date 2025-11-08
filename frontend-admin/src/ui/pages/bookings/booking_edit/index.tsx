import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowOutlinedIcon } from '@app/assets/icons';
import {
  useDeleteExcursionBookingMutation,
  useGetExcursionBookingQuery,
} from '@app/core/store/excursion_bookings';
import Booking from '@app/ui/components/Booking/';
import {
  ConfirmationModal,
  LocalButton,
  TablePreloader,
} from '@app/ui/components';
import { Skeleton } from '@mui/material';
import { toast } from 'react-toastify';

const BookingEdit: React.FC = () => {
  const [openConfirm, setOpenConfirm] = useState(false);

  const { id: paramsId } = useParams();

  const navigate = useNavigate();
  const back = () => navigate('/bookings');

  const {
    data,
    isError: loadExcursionBookingError,
    isLoading,
  } = useGetExcursionBookingQuery(
    {
      id: Number(paramsId),
      expand: ['excursion_time__excursion_date__excursion__attraction'],
    },
    { skip: Number.isNaN(parseInt(paramsId!, 10)) },
  );

  const [deleteExcursionBookingApi, { isError: deleteExcursionBookingError }] =
    useDeleteExcursionBookingMutation();

  const excursionBooking = data ? data.data : null;

  if (loadExcursionBookingError) toast.error('Ошибка загрузки бронирования');

  if (!excursionBooking) return <></>;

  const initialData = {
    id: excursionBooking.id,
    createdBy: excursionBooking.createdBy,
    createdDttm: excursionBooking.createdDttm,
    comment: excursionBooking.comment,
    visitors: excursionBooking.visitors,
    attraction:
      excursionBooking.excursionTime.excursionDate.excursion.attraction,
    excursionDate: excursionBooking.excursionTime.excursionDate,
    excursionTime: excursionBooking.excursionTime,
  };

  const deleteBooking = async () => {
    await deleteExcursionBookingApi({ id: excursionBooking.id });
    if (deleteExcursionBookingError)
      return toast.error('Ошибка удаления бронирования');
    back();
    return toast.success('Бронирование удалено!');
  };

  return (
    <>
      <div className="flex items-center justify-between h-[48px] mb-10">
        <div className="w-1/3 flex items-center h-full">
          <LocalButton onClick={back}>
            <ArrowOutlinedIcon direction="left" />
          </LocalButton>
          <span className="text-3xl ml-7">Карточка бронирования</span>
        </div>
        <div className="flex justify-end w-1/3">
          {isLoading ? (
            <Skeleton
              className="w-1/4"
              sx={{ bgcolor: 'light_gray', height: '56px' }}
              animation="wave"
            />
          ) : (
            <LocalButton variant="danger" onClick={() => setOpenConfirm(true)}>
              Удалить бронирование
            </LocalButton>
          )}
        </div>
      </div>
      {initialData ? (
        <Booking initialData={initialData} onSave={back} />
      ) : (
        <TablePreloader rowHeight={64} />
      )}
      <ConfirmationModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={deleteBooking}
      />
    </>
  );
};

export default BookingEdit;
