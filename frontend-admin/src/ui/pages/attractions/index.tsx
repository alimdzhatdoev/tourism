import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Attraction } from '@app/core/models';
import { InputAdornment, TextField, Tooltip } from '@mui/material';
import { useLazyGetAttractionsListQuery } from '@app/core/store/attractions';
import {
  AttractionCard,
  AttractionGroupingBar,
  CardsPreloader,
  LoadingProgress,
  LocalButton,
  SegmentedControl,
} from '@app/ui/components';
import { MagnifyingGlassIcon } from '@app/assets/icons';
import { useDebounce } from '@app/hooks';
import { LocalFilters } from '@app/ui/components/LocalFilters';
import { LocalRangeFilter } from '@app/ui/components/LocalRangeFilter';
import { useGetCategoriesListQuery } from '@app/core/store/categories';
import {
  ATTRACTION_STATUSES_ENUM,
  ATTRACTION_STATUSES_RU,
} from '@app/core/models/Attraction';

const TOP_BUTTONS: {
  title: string;
  value: 'katadze_attraction' | 'user_attractions';
}[] = [
  { title: 'Собственные объекты', value: 'katadze_attraction' },
  { title: 'Пользовательские объекты', value: 'user_attractions' },
];

const Attractions: React.FC = () => {
  const [activeSegment, setActiveSegment] =
    useState<(typeof TOP_BUTTONS)[0]['value']>('katadze_attraction');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [params] = useSearchParams();

  const debouncedParams = useDebounce(params);

  const search = useDebounce(searchTerm);

  const navigate = useNavigate();

  const [loadAttractionApi, { data, isError, isLoading, isFetching }] =
    useLazyGetAttractionsListQuery();

  const { data: categoriesApi } = useGetCategoriesListQuery({});

  useEffect(() => {
    loadAttractionApi({
      expand: [
        'photos',
        'location__city',
        'location__region',
        'categories__category',
      ],
      size: 9999,
      search,
      filters: {
        ordering: '-created_dttm',
        min_rating: debouncedParams.get('min_rating') ?? undefined,
        max_rating: debouncedParams.get('max_rating') ?? undefined,
        group_id: (debouncedParams.get('group_id') as any) ?? undefined,
        subgroup_id: debouncedParams.get('subgroup_id') ?? undefined,
        location__region_id:
          (debouncedParams.get('location__region_id') as any) ?? undefined,
        location__city_id:
          (debouncedParams.get('location__city_id') as any) ?? undefined,
        status__in: debouncedParams.get('status') ?? undefined,
        is_user_added: activeSegment === 'user_attractions',
      },
    });
  }, [search, loadAttractionApi, debouncedParams, activeSegment]);

  const categories = categoriesApi?.data ? categoriesApi.data.results : [];
  const attractions = useMemo(
    () => (data?.data ? data.data.results : []),
    [data?.data],
  );

  const handleViewAttractionClick = (id: Attraction['id']) => {
    navigate(`/attractions/${id}`);
  };

  const handleSegmentClick = (v: typeof activeSegment) => {
    setActiveSegment(v);
  };

  if (isError) {
    toast.error('Ошибка загрузки объектов', {
      toastId: 'attractions_list_error',
    });
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between h-[48px]">
          <div className="w-1/3">
            <Tooltip
              title={
                TOP_BUTTONS.find(b => b.value === activeSegment)?.title ?? ''
              }
            >
              <span className="text-3xl">
                {TOP_BUTTONS.find(b => b.value === activeSegment)?.title}
              </span>
            </Tooltip>
            <span className="text-3xl"></span>
          </div>
          <div className="flex justify-center w-1/3">
            <SegmentedControl<typeof activeSegment>
              buttons={TOP_BUTTONS}
              onSegmentClick={handleSegmentClick}
              activeSegment={activeSegment}
            />
          </div>
          <div className="flex justify-end w-1/3">
            <LocalButton onClick={() => navigate('/attractions/new')}>
              Добавить новый объект
            </LocalButton>
          </div>
        </div>
        <AttractionGroupingBar className="mt-6" />
        <div className="mt-6 flex w-full gap-5">
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
          <LocalFilters
            field="status"
            label="Все"
            options={Object.values(ATTRACTION_STATUSES_ENUM).map(s => ({
              id: s,
              label: ATTRACTION_STATUSES_RU[s],
            }))}
          />
          {categories.length > 0 && (
            <LocalFilters
              field="category"
              label="Категория"
              options={categories.map(({ name }) => ({
                id: name,
                label: name,
              }))}
            />
          )}
          <LocalRangeFilter
            label="Оценки"
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
            <div className="flex flex-wrap my-10 gap-8">
              {attractions.map(a => (
                <AttractionCard
                  key={a.id}
                  attraction={a}
                  onClick={handleViewAttractionClick}
                />
              ))}
            </div>
          </>
        )}
        {!attractions.length && !isLoading && (
          <div className="flex flex-col items-center justify-center mt-10">
            <span className="text-2xl">Нет объектов</span>
            <span>Попробуйте изменить фильтр</span>
          </div>
        )}
        <LoadingProgress show={isFetching} />
      </div>
    </>
  );
};

export default Attractions;
