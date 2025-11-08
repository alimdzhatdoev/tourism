import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyGetExcursionBookingsListQuery } from '@app/core/store/excursion_bookings';
import { useDebounce, useURLPagination } from '@app/hooks';
import { LocalButton, TablePreloader } from '@app/ui/components';
import { LocalFilters } from '@app/ui/components/LocalFilters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import dayjs from 'dayjs';
import { dateTimeFormats } from '@app/constants';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';

const FILTER_OPTIONS: {
  label: string;
  id: 'created_dttm' | '-created_dttm' | '-date' | 'date';
}[] = [
  { label: 'Дата создания: сначала старые', id: 'created_dttm' },
  { label: 'Дата создания: сначала новые', id: '-created_dttm' },
  { label: 'Дата события: сначала старые', id: 'date' },
  { label: 'Дата события: сначала новые', id: '-date' },
];

const Bookings: React.FC = () => {
  const [params] = useSearchParams();
  const debouncedParams = useDebounce(params);

  const navigate = useNavigate();

  const {
    page,
    size,
    total,
    pageCount,
    setTotal,
    setPageCount,
    handlePaginationChange,
  } = useURLPagination({
    defaultPage: 1,
    defaultSize: 10,
  });

  const [loadExcursionBookingsApi, { data, isError, isLoading }] =
    useLazyGetExcursionBookingsListQuery();

  useEffect(() => {
    loadExcursionBookingsApi({
      expand: ['excursion_time__excursion_date__excursion__attraction'],
      size,
      page,
      filters: {
        ordering: debouncedParams.get('ordering')
          ? debouncedParams.get('ordering')
          : undefined,
      },
    });
  }, [size, page, loadExcursionBookingsApi, debouncedParams]);

  if (isError) toast.error('Ошибка загрузки бронирований');

  useEffect(() => {
    if (data?.data) {
      setTotal(data.data.count);
      setPageCount(data.data.pageCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data]);

  const excursionBookingsData = data ? data.data.results : [];

  return (
    <div className="flex flex-col">
      <div className="w-1/3">
        <span className="text-3xl">Бронирования</span>
      </div>
      <div className="mt-12 mb-10 w-1/5">
        <LocalFilters
          field="ordering"
          label="Сортировка"
          options={FILTER_OPTIONS}
        />
      </div>
      {!excursionBookingsData.length && isLoading ? (
        <TablePreloader rowHeight={64} />
      ) : (
        <div className="flex rounded-lg bg-slate-50 p-5 border border-black">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">id</TableCell>
                <TableCell align="center">Дата создания</TableCell>
                <TableCell align="center">Создатель</TableCell>
                <TableCell align="center">Объект</TableCell>
                <TableCell align="center">Дата</TableCell>
                <TableCell align="center">Время</TableCell>
                <TableCell align="center">Цена</TableCell>
                <TableCell align="center">Кол-во</TableCell>
                <TableCell align="center">Сумма</TableCell>
                <TableCell align="center">Комментарий</TableCell>
                <TableCell align="center">Изменить</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {excursionBookingsData.map(booking => (
                <TableRow
                  key={booking.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="center">{booking.id}</TableCell>
                  <TableCell align="center">
                    {dayjs(booking.createdDttm).format(dateTimeFormats.date)}
                  </TableCell>
                  <TableCell align="center">
                    {booking.createdBy.fullName}
                  </TableCell>
                  <TableCell align="center">
                    {
                      booking.excursionTime.excursionDate.excursion.attraction
                        .name
                    }
                  </TableCell>
                  <TableCell align="center">
                    {dayjs(booking.date).format(dateTimeFormats.date)}
                  </TableCell>
                  <TableCell align="center">
                    {dayjs(booking.date + booking.time).format(
                      dateTimeFormats.time,
                    )}
                  </TableCell>
                  <TableCell align="center">{booking.price} ₽</TableCell>
                  <TableCell align="center">{booking.visitors} чел.</TableCell>
                  <TableCell align="center">{booking.totalPrice} ₽</TableCell>
                  <TableCell align="center">{booking.comment}</TableCell>
                  <TableCell align="center">
                    <LocalButton
                      className="aspect-square"
                      onClick={() => navigate(`/bookings/${booking.id}`)}
                    >
                      <EditIcon />
                    </LocalButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <TablePagination
        component="div"
        className="mt-12"
        rowsPerPage={size}
        labelRowsPerPage={
          <span className="font-muller_medium">Записей на странице:</span>
        }
        labelDisplayedRows={pagination => (
          <span className="font-muller_medium">{`${pagination.page} стр.`}</span>
        )}
        page={page}
        count={total !== 0 ? total * 10 : -1}
        onPageChange={(_, p) => {
          if (p > pageCount) return;
          handlePaginationChange('page', p);
        }}
        onRowsPerPageChange={e =>
          handlePaginationChange('size', Number(e.target.value))
        }
      />
    </div>
  );
};

export default Bookings;
