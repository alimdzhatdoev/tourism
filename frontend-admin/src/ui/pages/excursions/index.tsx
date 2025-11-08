import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce, useURLPagination } from '@app/hooks';
import {
  ConfirmationModal,
  LocalButton,
  SegmentedControl,
  TablePreloader,
} from '@app/ui/components';
import { LocalFilters } from '@app/ui/components/LocalFilters';
import {
  Autocomplete,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material';
import dayjs from 'dayjs';
import { dateTimeFormats } from '@app/constants';
import { Close as CloseIcon } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import {
  useCreateExcursionMutation,
  useDeleteExcursionMutation,
  useLazyGetExcursionsListQuery,
} from '@app/core/store/excursions';
import { Attraction, Excursion, Route } from '@app/core/models';
import { useLazyGetAttractionsListQuery } from '@app/core/store/attractions';
import { useLazyGetRoutesListQuery } from '@app/core/store/routes';
import { Form, Formik } from 'formik';

const ADD_MODAL_BUTTONS: {
  title: string;
  value: 'attraction' | 'route';
}[] = [
  { title: 'Объект', value: 'attraction' },
  { title: 'Маршрут', value: 'route' },
];

const FILTER_OPTIONS: {
  label: string;
  id: 'created_dttm' | '-created_dttm';
}[] = [
  { label: 'Дата создания: сначала старые', id: 'created_dttm' },
  { label: 'Дата создания: сначала новые', id: '-created_dttm' },
];

type Modal =
  | {
      modal: 'add';
    }
  | {
      modal: 'del';
      id: Excursion['id'];
    };

interface FromikValues {
  entity: { id: number; name: string } | null;
  isActive: boolean;
}

const Excursions: React.FC = () => {
  const [params] = useSearchParams();
  const debouncedParams = useDebounce(params);

  const [openModal, setOpenModal] = useState<Modal | null>(null);
  const [entityName, setEntityName] =
    useState<NonNullable<FromikValues['entity']>['name']>('');

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

  const [loadExcursionApi, { data, isError, isLoading }] =
    useLazyGetExcursionsListQuery();

  useEffect(() => {
    loadExcursionApi({
      expand: ['schedule_dates__times', 'attraction', 'route'],
      size,
      page,
      filters: {
        ordering: debouncedParams.get('ordering')
          ? debouncedParams.get('ordering')
          : null,
      },
    });
  }, [size, page, loadExcursionApi, debouncedParams]);

  if (isError) toast.error('Ошибка загрузки экскурсий');

  useEffect(() => {
    if (data?.data) {
      setTotal(data.data.count);
      setPageCount(data.data.pageCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data]);

  const excursionData = data ? data.data.results : [];

  const [deleteExcursionApi] = useDeleteExcursionMutation();

  const handleDeleteExcursion = async () => {
    if (openModal?.modal === 'del') {
      try {
        await deleteExcursionApi({
          id: openModal.id,
        }).unwrap();
        toast.success('Экскурсия удалена');
      } catch (error) {
        toast.error('Ошибка удаления экскурсии');
        console.error(error);
      }
    }
    setOpenModal(null);
  };

  const [activeSegment, setActiveSegment] =
    useState<typeof ADD_MODAL_BUTTONS[0]['value']>('attraction');

  const [
    loadAttractionsApi,
    { data: attractionsData, isLoading: attractionsDataLoading },
  ] = useLazyGetAttractionsListQuery();
  const [loadRoutesApi, { data: routesData, isLoading: routesDataLoading }] =
    useLazyGetRoutesListQuery();

  const loadEntitiesApi = useCallback(() => {
    activeSegment === 'route'
      ? loadRoutesApi({ size: 1000 })
      : loadAttractionsApi({ size: 1000 });
  }, [activeSegment, loadRoutesApi, loadAttractionsApi]);

  const entitiesData = useMemo(
    () =>
      activeSegment === 'attraction'
        ? (attractionsData?.data.results as Attraction[]) || []
        : (routesData?.data.results as Route[]) || [],
    [activeSegment, attractionsData, routesData],
  );

  useEffect(() => {
    loadEntitiesApi();
  }, [activeSegment, loadEntitiesApi]);

  const handleSegmentClick = (v: typeof activeSegment) => {
    setActiveSegment(v);
  };

  const initialValues: FromikValues = {
    entity: null,
    isActive: false,
  };

  const [createExcursionApi] = useCreateExcursionMutation();

  const handleAddExcursionSubmit = async (values: typeof initialValues) => {
    if (!values.entity) return;
    try {
      const entity =
        activeSegment === 'attraction'
          ? { attraction: values.entity.id, route: null }
          : { route: values.entity.id, attraction: null };
      const newExcursion = await createExcursionApi({
        ...entity,
        isActive: values.isActive,
      }).unwrap();
      toast.success('Экскурсия создана');
      navigate('/excursions/' + newExcursion.data.id);
    } catch (error) {
      console.error(error);
      toast.error('Ошибка создания экскурсии');
      setOpenModal(null);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between h-[48px]">
        <span className="text-3xl">Экскурсии</span>
        <div className="flex justify-end w-1/3">
          <LocalButton
            onClick={() => {
              loadEntitiesApi();
              setOpenModal({ modal: 'add' });
            }}
          >
            Добавить новую экскурсию
          </LocalButton>
        </div>
      </div>
      <div className="mt-12 mb-10 w-1/5">
        <LocalFilters
          field="ordering"
          label="Сортировка"
          options={FILTER_OPTIONS}
        />
      </div>
      {!excursionData.length && isLoading ? (
        <TablePreloader rowHeight={64} />
      ) : (
        <div className="flex rounded-lg bg-slate-50 p-5 border border-black">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">id</TableCell>
                <TableCell align="center">Дата создания</TableCell>
                <TableCell align="center">Создатель</TableCell>
                <TableCell align="center">Тип</TableCell>
                <TableCell align="center">Название</TableCell>
                <TableCell align="center">Статус</TableCell>
                <TableCell align="center">Изменить</TableCell>
                <TableCell align="center">Удалить</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {excursionData.map(excursion => (
                <TableRow
                  key={excursion.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="center">{excursion.id}</TableCell>
                  <TableCell align="center">
                    {dayjs(excursion.createdDttm).format(dateTimeFormats.date)}
                  </TableCell>
                  <TableCell align="center">
                    {excursion.createdBy.fullName}
                  </TableCell>
                  <TableCell align="center">
                    {excursion.attraction.id ? 'Объект' : 'Маршрут'}
                  </TableCell>
                  <TableCell align="center">
                    {excursion.attraction.id
                      ? excursion.attraction.name
                      : excursion.route.name}
                  </TableCell>
                  <TableCell align="center">
                    {excursion.isActive ? 'Действующая' : 'Не действующая'}
                  </TableCell>
                  <TableCell align="center">
                    <LocalButton
                      className="aspect-square"
                      onClick={() => navigate(`/excursions/${excursion.id}`)}
                    >
                      <EditIcon />
                    </LocalButton>
                  </TableCell>
                  <TableCell align="center">
                    <LocalButton
                      className="aspect-square"
                      variant="contained"
                      onClick={() =>
                        setOpenModal({ modal: 'del', id: excursion.id })
                      }
                    >
                      <DeleteIcon />
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

      <Dialog
        open={openModal?.modal === 'add'}
        onClose={() => setOpenModal(null)}
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
          <Formik<FromikValues>
            initialValues={initialValues}
            onSubmit={handleAddExcursionSubmit}
          >
            {({ isSubmitting, handleSubmit, setFieldValue, values }) => (
              <Form className="flex flex-col gap-5">
                <span className="text-3xl text-center mb-5">
                  Новая экскурсия
                </span>
                <span className="text-xl block">Тип</span>
                <SegmentedControl<typeof activeSegment>
                  buttons={ADD_MODAL_BUTTONS}
                  onSegmentClick={handleSegmentClick}
                  activeSegment={activeSegment}
                />

                <span className="text-xl block">
                  {activeSegment === 'route' ? 'Маршрут' : 'Объект'}
                </span>
                <Autocomplete
                  value={values.entity}
                  onChange={(_, v) => setFieldValue('entity', v)}
                  inputValue={entityName}
                  onInputChange={(_, v) => setEntityName(v)}
                  options={entitiesData.map(e => ({
                    name: e.name,
                    id: e.id,
                  }))}
                  renderInput={props => <TextField {...props} size="medium" />}
                  getOptionLabel={option => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  disabled={attractionsDataLoading || routesDataLoading}
                  noOptionsText="Не найдено"
                />

                <span className="text-xl block">Статус</span>
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

                <LocalButton
                  type="submit"
                  onClick={() => handleSubmit()}
                  disabled={isSubmitting}
                  className="my-5"
                >
                  Добавить
                </LocalButton>
              </Form>
            )}
          </Formik>
        </div>
      </Dialog>

      <ConfirmationModal
        open={openModal?.modal === 'del'}
        onClose={() => setOpenModal(null)}
        onConfirm={handleDeleteExcursion}
      />
    </div>
  );
};

export default Excursions;
