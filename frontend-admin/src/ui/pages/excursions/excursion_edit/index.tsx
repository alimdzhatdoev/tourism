import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowOutlinedIcon } from '@app/assets/icons';
import { LocalButton, ConfirmationModal } from '@app/ui/components';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Skeleton,
  TextField,
  Autocomplete,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  InputAdornment,
} from '@mui/material';
import { toast } from 'react-toastify';
import {
  useDeleteExcursionMutation,
  useLazyGetExcursionQuery,
  useUpdateExcursionMutation,
} from '@app/core/store/excursions';
import { Form, Formik } from 'formik';
import {
  Attraction,
  ExcursionDate,
  ExcursionTime,
  Route,
} from '@app/core/models';
import { useLazyGetAttractionsListQuery } from '@app/core/store/attractions';
import { useLazyGetRoutesListQuery } from '@app/core/store/routes';
import { dateTimeFormats } from '@app/constants';
import dayjs from 'dayjs';
import {
  useCreateExcursionDateMutation,
  useDeleteExcursionDateMutation,
} from '@app/core/store/excursion_dates';
import {
  useCreateExcursionTimeMutation,
  useDeleteExcursionTimeMutation,
} from '@app/core/store/excursion_times';
import {
  ExcursionDateCreateRequest,
  ExcursionTimeCreateRequest,
} from '@app/core/types/requests';

type Modal =
  | {
      modal: 'add_date' | 'del_excursion';
    }
  | {
      modal: 'add_time';
      id: ExcursionTime['excursionDateId'];
    }
  | {
      modal: 'del_date' | 'del_time';
      id: ExcursionDate['id'] | ExcursionTime['id'];
    };

const DEFAULT_ADD_TIME_DATA = {
  maxVisitors: 1,
  price: 0,
  time: '',
};

const DEFAULT_ADD_DATE_DATA = {
  date: '',
};

const ExcursionEdit: React.FC = () => {
  const [openModal, setOpenModal] = useState<Modal | null>(null);
  const [modalState, setModalState] = useState('add_date');

  const [addDateData, setAddDateData] = useState<
    Omit<ExcursionDateCreateRequest, 'excursion'>
  >(DEFAULT_ADD_DATE_DATA);
  const [addTimeData, setAddTimeData] = useState<
    Omit<ExcursionTimeCreateRequest, 'excursionDate'>
  >(DEFAULT_ADD_TIME_DATA);

  useEffect(() => {
    if (openModal?.modal === 'add_date' || openModal?.modal === 'add_time') {
      setModalState(openModal.modal);
    }
  }, [openModal]);

  const { id: paramsId } = useParams();

  const navigate = useNavigate();
  const back = () => navigate('/excursions');

  const [loadExcursionApi, { data, isError: loadExcursionError, isLoading }] =
    useLazyGetExcursionQuery();

  const loadExcursionData = useCallback(() => {
    loadExcursionApi(
      {
        id: Number(paramsId),
        expand: ['schedule_dates__times', 'attraction', 'route'],
      },
      Number.isNaN(parseInt(paramsId!, 10)),
    );
  }, [loadExcursionApi, paramsId]);

  useEffect(() => {
    loadExcursionData();
  }, [loadExcursionData]);

  const [
    loadAttractionsApi,
    { data: attractionsData, isLoading: attractionsDataLoading },
  ] = useLazyGetAttractionsListQuery();
  const [loadRoutesApi, { data: routesData, isLoading: routesDataLoading }] =
    useLazyGetRoutesListQuery();

  const excursion = data ? data.data : null;

  const loadEntitiesApi = useCallback(() => {
    if (excursion) {
      excursion.attraction.id === 0
        ? loadRoutesApi({ size: 1000 })
        : loadAttractionsApi({ size: 1000 });
    }
  }, [excursion, loadRoutesApi, loadAttractionsApi]);

  const entitiesData = useMemo(
    () =>
      (attractionsData?.data.results as Attraction[]) ||
      (routesData?.data.results as Route[]) ||
      [],
    [attractionsData, routesData],
  );

  useEffect(() => {
    loadEntitiesApi();
  }, [loadEntitiesApi]);

  if (loadExcursionError) toast.error('Ошибка загрузки экскурсии');

  const [createExcursionDateApi] = useCreateExcursionDateMutation();
  const [createExcursionTimeApi] = useCreateExcursionTimeMutation();
  const [deleteExcursionTimeApi] = useDeleteExcursionTimeMutation();
  const [deleteExcursionDateApi] = useDeleteExcursionDateMutation();
  const [updateExcursionApi] = useUpdateExcursionMutation();
  const [deleteExcursionApi] = useDeleteExcursionMutation();

  if (!excursion) return <></>;

  const initialValues = {
    entity: {
      id: excursion.attraction.id || excursion.route.id,
      name: excursion.attraction.name || excursion.route.name,
    },
    isActive: excursion.isActive,
  };

  const handleModalClose = () => {
    setOpenModal(null);
    setAddDateData(DEFAULT_ADD_DATE_DATA);
    setAddTimeData(DEFAULT_ADD_TIME_DATA);
  };

  const handleModalButtonClick = async () => {
    if (openModal?.modal === 'add_date') {
      try {
        await createExcursionDateApi({
          ...addDateData,
          excursion: excursion.id,
        }).unwrap();
        toast.success('Дата создана');
        loadExcursionData();
      } catch (error) {
        toast.error('Ошибка создания даты');
        console.error(error);
      }
    }
    if (openModal?.modal === 'add_time') {
      try {
        await createExcursionTimeApi({
          ...addTimeData,
          excursionDate: openModal.id,
        }).unwrap();
        toast.success('Время создано');
        loadExcursionData();
      } catch (error) {
        toast.error('Ошибка создания времени');
        console.error(error);
      }
    }
    handleModalClose();
  };

  const handleSubmitClick = async () => {
    if (openModal?.modal === 'del_time') {
      try {
        await deleteExcursionTimeApi({ id: openModal.id }).unwrap();
        toast.success('Время удалено');
        loadExcursionData();
      } catch (error) {
        toast.error('Ошибка удаления времени');
        console.error(error);
      }
    }
    if (openModal?.modal === 'del_date') {
      try {
        await deleteExcursionDateApi({ id: openModal.id }).unwrap();
        toast.success('Дата удалена');
        loadExcursionData();
      } catch (error) {
        toast.error('Ошибка удаления даты');
        console.error(error);
      }
    }
    if (openModal?.modal === 'del_excursion') {
      try {
        await deleteExcursionApi({
          id: excursion.id,
        }).unwrap();
        toast.success('Экскурсия удалена');
        return back();
      } catch (error) {
        toast.error('Ошибка удаления экскурсии');
        console.error(error);
      }
    }
    return handleModalClose();
  };

  const handleUpdateExcursionSubmit = async (values: {
    entity: {
      id: number;
      name: string;
    };
    isActive: boolean;
  }) => {
    try {
      const entityUpdates =
        excursion.attraction.id !== 0
          ? { attraction: values.entity.id, route: null }
          : { route: values.entity.id, attraction: null };
      await updateExcursionApi({
        id: excursion.id,
        isActive: values.isActive,
        ...entityUpdates,
      }).unwrap();
      toast.success('Экскурсия обновлена');
      loadExcursionData();
    } catch (error) {
      toast.error('Ошибка обновления экскурсии');
      console.error(error);
    }
    handleModalClose();
  };

  return (
    <>
      <div className="flex items-center justify-between h-[48px] mb-10">
        <div className="w-1/3 flex items-center h-full">
          <LocalButton onClick={back}>
            <ArrowOutlinedIcon direction="left" />
          </LocalButton>
          <span className="text-3xl ml-7">Карточка экскурсии</span>
        </div>
        <div className="flex justify-end w-1/3">
          {isLoading ? (
            <Skeleton
              className="w-1/4"
              sx={{ bgcolor: 'light_gray', height: '56px' }}
              animation="wave"
            />
          ) : (
            <LocalButton
              variant="danger"
              onClick={() => setOpenModal({ modal: 'del_excursion' })}
            >
              Удалить экскурсию
            </LocalButton>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center justify-between mb-10">
        <Formik<typeof initialValues>
          initialValues={initialValues}
          onSubmit={handleUpdateExcursionSubmit}
        >
          {({ isSubmitting, handleSubmit, setFieldValue, values }) => (
            <Form className="w-full">
              <div className="flex gap-10 row pb-5 w-full">
                <div className="w-full">
                  <span className="text-xl mb-2.5 block">
                    {excursion.attraction.id === 0 ? 'Маршрут' : 'Объект'}
                  </span>
                  <Autocomplete
                    getOptionLabel={option => option.name}
                    filterOptions={options => options}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    inputValue={values.entity.name}
                    options={entitiesData.map(e => ({
                      name: e.name,
                      id: e.id,
                    }))}
                    renderInput={props => (
                      <TextField {...props} name="entity" size="medium" />
                    )}
                    onChange={(_, v) =>
                      v && setFieldValue('entity', { name: v.name, id: v.id })
                    }
                    disabled={attractionsDataLoading || routesDataLoading}
                  />
                </div>
                <div className="w-full">
                  <span className="text-xl mb-2.5 block">Статус</span>
                  <Autocomplete
                    getOptionLabel={option => option}
                    filterOptions={options => options}
                    isOptionEqualToValue={(option, value) => option === value}
                    inputValue={
                      values.isActive ? 'Действующая' : 'Не действующая'
                    }
                    options={['Действующая', 'Не действующая']}
                    renderInput={props => (
                      <TextField {...props} name="isActive" size="medium" />
                    )}
                    onChange={(_, v) =>
                      v && setFieldValue('isActive', v === 'Действующая')
                    }
                  />
                </div>
                <div className="flex flex-col justify-end items-center">
                  <LocalButton
                    type="submit"
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting}
                  >
                    Сохранить
                  </LocalButton>
                </div>
              </div>
            </Form>
          )}
        </Formik>
        <span className="text-3xl w-full text-left mt-5">
          Расписание экскурсии
        </span>
        <div className="flex rounded-lg bg-slate-50 border border-black mt-5 w-full">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <LocalButton
                    type="submit"
                    className="w-[240px]"
                    onClick={() => setOpenModal({ modal: 'add_date' })}
                  >
                    Добавить дату
                  </LocalButton>
                </TableCell>
                <TableCell align="center">
                  <span className="text-xl">Дата</span>
                </TableCell>
                <TableCell align="center" className="text-3xl">
                  <span className="text-xl">Время</span>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {excursion.scheduleDates.map(date => (
                <TableRow
                  key={date.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell align="left" className="w-[225px]">
                    <div className="flex flex-row gap-5">
                      <LocalButton
                        type="submit"
                        className="w-[110px] text-white"
                        variant="contained"
                        onClick={() =>
                          setOpenModal({ modal: 'del_date', id: date.id })
                        }
                      >
                        Удалить дату
                      </LocalButton>
                      <LocalButton
                        type="submit"
                        className="w-[110px]"
                        onClick={() =>
                          setOpenModal({ modal: 'add_time', id: date.id })
                        }
                      >
                        Добавить время
                      </LocalButton>
                    </div>
                  </TableCell>
                  <TableCell align="center" className="w-[50%]">
                    {dayjs(date.date).format(dateTimeFormats.date)}
                  </TableCell>
                  <TableCell align="center" className="w-[50%]">
                    <Table>
                      <TableBody>
                        {date.times.map(time => (
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': {
                                border: 0,
                                paddingBottom: 0,
                              },
                              '&:first-child td, &:first-child th': {
                                paddingTop: 0,
                              },
                            }}
                            key={time.id}
                          >
                            <TableCell align="right" className="pl-50">
                              {time.time}
                            </TableCell>
                            <TableCell align="right" className="pl-50">
                              {time.maxVisitors} чел.
                            </TableCell>
                            <TableCell align="right" className="pl-50">
                              {time.price} ₽
                            </TableCell>
                            <TableCell align="right">
                              <LocalButton
                                type="submit"
                                className="w-[110px] text-white"
                                variant="contained"
                                onClick={() =>
                                  setOpenModal({
                                    modal: 'del_time',
                                    id: time.id,
                                  })
                                }
                              >
                                Удалить время
                              </LocalButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog
          open={
            openModal?.modal === 'add_date' || openModal?.modal === 'add_time'
          }
          onClose={handleModalClose}
          PaperProps={{
            style: {
              borderRadius: 24,
            },
          }}
          maxWidth="xl"
        >
          <div className="flex flex-col justify-center align-center w-[400px] p-5 relative">
            <LocalButton
              className="self-end mb-2"
              variant="text"
              onClick={() => setOpenModal(null)}
            >
              <CloseIcon sx={{ color: 'black' }} fontSize="medium" />
            </LocalButton>
            {modalState === 'add_date' ? (
              <>
                <span className="text-3xl text-center mb-5">Новая дата</span>
                <TextField
                  type="date"
                  size="medium"
                  className="w-[70%] self-center"
                  value={addDateData?.date}
                  onChange={e =>
                    setAddDateData({
                      date: e.target.value,
                    })
                  }
                />
              </>
            ) : (
              <div className="flex flex-col gap-5">
                <span className="text-3xl text-center mb-5">Новое время</span>
                <TextField
                  type="time"
                  size="medium"
                  className="w-[70%] self-center"
                  value={addTimeData.time}
                  onChange={e =>
                    setAddTimeData(prev => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                />
                <TextField
                  type="number"
                  size="medium"
                  className="w-[70%] self-center mt-5"
                  label="Цена"
                  value={addTimeData.price}
                  onChange={e =>
                    setAddTimeData(prev => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">₽</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  type="number"
                  size="medium"
                  className="w-[70%] self-center mt-5"
                  label="Макс. посетителей"
                  value={addTimeData.maxVisitors}
                  onChange={e =>
                    setAddTimeData(prev => ({
                      ...prev,
                      maxVisitors: Number(e.target.value),
                    }))
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">чел.</InputAdornment>
                    ),
                  }}
                />
              </div>
            )}
            <div className="flex flex-row justify-center w-full mt-10">
              <LocalButton onClick={handleModalButtonClick}>
                Добавить
              </LocalButton>
            </div>
          </div>
        </Dialog>

        <ConfirmationModal
          open={
            openModal?.modal === 'del_date' ||
            openModal?.modal === 'del_time' ||
            openModal?.modal === 'del_excursion'
          }
          onClose={() => setOpenModal(null)}
          onConfirm={handleSubmitClick}
        />
      </div>
    </>
  );
};

export default ExcursionEdit;
