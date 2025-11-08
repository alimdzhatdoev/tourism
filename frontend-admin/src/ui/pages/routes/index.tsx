import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Route } from '@app/core/models';
import { useLazyGetRoutesListQuery } from '@app/core/store/routes';
import {
  CardsPreloader,
  LoadingProgress,
  LocalButton,
  RouteCard,
} from '@app/ui/components';
import { useDebounce } from '@app/hooks';
import { InputAdornment, TextField } from '@mui/material';
import { MagnifyingGlassIcon } from '@app/assets/icons';

const Routes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const search = useDebounce(searchTerm);

  const navigate = useNavigate();

  const [getRoutesApi, { data, isLoading, isError, isFetching }] =
    useLazyGetRoutesListQuery();

  const loadRoutes = useCallback(async () => {
    await getRoutesApi({
      expand: ['photos'],
      search,
      size: 9999,
    });
  }, [getRoutesApi, search]);

  const routes = data?.data ? data.data.results : [];

  const handleRouteClick = (id: Route['id']) => {
    navigate(`/routes/${id}`);
  };

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  if (isError)
    toast.error('Ошибка загрузки маршрутов', {
      toastId: 'routes_list_error',
    });

  return (
    <div className="relative">
      <div className="flex items-center justify-between h-[48px]">
        <span className="text-3xl">Маршруты</span>
        <LocalButton onClick={() => navigate('/routes/new')}>
          Добавить новый маршрут
        </LocalButton>
      </div>
      <div className="flex items-stretch mt-12 mb-10">
        <div className="w-1/3">
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
        </div>
      </div>

      {!routes.length && isLoading && (
        <CardsPreloader className="flex flex-wrap my-10 gap-8" cardsCount={4} />
      )}
      {!!routes.length && (
        <>
          <div className="flex flex-wrap my-10 gap-8">
            {routes.map(r => (
              <RouteCard key={r.id} route={r} onClick={handleRouteClick} />
            ))}
          </div>
        </>
      )}
      {!routes.length && !isLoading && (
        <div className="flex flex-col items-center justify-center mt-10">
          <span className="text-2xl">Нет маршрутов</span>
          <span>Попробуйте изменить фильтр</span>
        </div>
      )}
      <LoadingProgress show={isFetching} />
    </div>
  );
};

export default Routes;
