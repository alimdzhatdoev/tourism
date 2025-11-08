import React, { useContext, useEffect, useState } from 'react';
import {
  Dialog,
  InputAdornment,
  TablePagination,
  TextField,
} from '@mui/material';
import { Close as CloseIcon, Check as CheckIcon } from '@mui/icons-material';
import { LocalButton } from '@app/ui/components/LocalButton';
import { MagnifyingGlassIcon } from '@app/assets/icons';
import { LocalFilters } from '@app/ui/components/LocalFilters';
import { LocalRangeFilter } from '@app/ui/components/LocalRangeFilter';
import { CardsPreloader } from '@app/ui/components/Preloaders';
import { AttractionCard } from '@app/ui/components/AttractionCard';
import Attraction from '@app/core/models/Attraction';
import { useSearchParams } from 'react-router-dom';
import { useDebounce, useURLPagination } from '@app/hooks';
import { useLazyGetAttractionsListQuery } from '@app/core/store/attractions';
import { useGetCitiesListQuery } from '@app/core/store/cities';
import { useGetCategoriesListQuery } from '@app/core/store/categories';
import { toast } from 'react-toastify';
import { BookingContext } from '.';
import { UseBookingReturnType } from '@app/hooks/useBooking';

interface AttractionsModalProps {
  open: boolean;
  closeModal: () => void;
}

const AttractionsModal: React.FC<AttractionsModalProps> = ({
  open,
  closeModal,
}) => {
  const [{ selectedAttraction }, { setSelectedAttraction }] = useContext(
    BookingContext,
  ) as UseBookingReturnType;

  const [selected, setSelected] = useState<Attraction>(selectedAttraction);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [params] = useSearchParams();

  const debouncedParams = useDebounce(params);

  const search = useDebounce(searchTerm);

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
    defaultSize: 6,
  });

  const [loadAttractionApi, { data, isError, isLoading }] =
    useLazyGetAttractionsListQuery();

  const { data: citiesApi } = useGetCitiesListQuery({});
  const { data: categoriesApi } = useGetCategoriesListQuery({});

  useEffect(() => {
    loadAttractionApi({
      expand: [
        'photos',
        'location__city',
        'location__region',
        'categories__category',
        'excursions',
      ],
      size,
      page,
      search,
      filters: {
        ordering: '-created_dttm',
        min_rating: debouncedParams.get('min_rating') ?? undefined,
        max_rating: debouncedParams.get('max_rating') ?? undefined,
        location__city__city__in: debouncedParams.get('place')
          ? debouncedParams.get('place')
          : undefined,
        categories__category__name__in: debouncedParams.get('category')
          ? debouncedParams.get('category')
          : undefined,
        status__in: 'PUBLISHED',
      },
    });
  }, [size, page, search, loadAttractionApi, debouncedParams]);

  const cities = citiesApi?.data ? citiesApi.data.results : [];
  const categories = categoriesApi?.data ? categoriesApi.data.results : [];
  const attractions = data?.data ? data.data.results : [];

  useEffect(() => {
    if (data?.data) {
      setTotal(data.data.count);
      setPageCount(data.data.pageCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data]);

  if (isError)
    toast.error('Ошибка загрузки объектов', {
      toastId: 'attractions_list_error',
    });

  const handleSaveClick = () => {
    setSelectedAttraction(selected);
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
      <div className="flex flex-col justify-center align-center min-w-[1200px] p-5 relative">
        <LocalButton
          className="self-end mb-2"
          variant="text"
          onClick={closeModal}
        >
          <CloseIcon sx={{ color: 'black' }} fontSize="medium" />
        </LocalButton>
        <span className="text-3xl text-center">Выберите объект</span>
        <div className="flex flex-1 flex-col justify-between font-muller_regular relative my-7">
          <div className="flex w-full">
            <TextField
              fullWidth
              placeholder="Поиск"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlassIcon />
                  </InputAdornment>
                ),
              }}
            />
            {categories.length > 0 && (
              <LocalFilters
                field="category"
                classname="ml-5"
                label="Категория"
                options={categories.map(({ name }) => ({
                  id: name,
                  label: name,
                }))}
              />
            )}
            {cities.length > 0 && (
              <LocalFilters
                field="place"
                classname="ml-5"
                label="Территория"
                options={cities.map(({ city }) => ({
                  id: city,
                  label: city,
                }))}
              />
            )}
            <LocalRangeFilter
              label="Оценки"
              classname="ml-5"
              field={['min_rating', 'max_rating']}
              options={[1, 5]}
            />
          </div>
          {!attractions.length && isLoading && (
            <CardsPreloader
              className="flex flex-wrap my-10 gap-8"
              cardsCount={4}
            />
          )}
          {!!attractions.length && (
            <>
              <div className="flex flex-wrap my-7 gap-8">
                {attractions.map(a => (
                  <div className="relative" key={a.id}>
                    {selected && selected.id === a.id && (
                      <div className="absolute flex flex-col justify-center items-center w-full h-full">
                        <div className="absolute z-[3]">
                          <CheckIcon sx={{ fontSize: 70 }} color="primary" />
                        </div>
                        <div className="absolutet-0 w-full h-full rounded-xl bg-black z-[2] opacity-50" />
                      </div>
                    )}
                    <AttractionCard
                      attraction={a}
                      onClick={() => setSelected(a)}
                      hideStatus
                    />
                  </div>
                ))}
              </div>
              <TablePagination
                component="div"
                rowsPerPage={size}
                rowsPerPageOptions={[6, 9, 12, 20]}
                labelRowsPerPage={
                  <span className="font-muller_medium">
                    Записей на странице:
                  </span>
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
            </>
          )}
          {!attractions.length && !isLoading && (
            <div className="flex flex-col items-center justify-center mt-10">
              <span className="text-2xl">Нет объектов</span>
              <span>Попробуйте изменить фильтр</span>
            </div>
          )}
        </div>
        <div className="flex flex-row justify-center w-full">
          <LocalButton onClick={handleSaveClick}>Сохранить</LocalButton>
        </div>
      </div>
    </Dialog>
  );
};

export default AttractionsModal;
