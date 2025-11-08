import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import cn from 'classnames';
import { InputAdornment, TablePagination, TextField } from '@mui/material';
import {
  BannerDrawer,
  ConfirmationModal,
  LocalButton,
  TablePreloader,
} from '@app/ui/components';
import { AttractionDiscount, Banner } from '@app/core/models';
import { MagnifyingGlassIcon } from '@app/assets/icons';
import { useDebounce, useURLPagination } from '@app/hooks';
import {
  useDeleteBannerMutation,
  useLazyGetBannersListQuery,
} from '@app/core/store/banner';

const Promo: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [viewOrEditBanner, setViewOrEditBanner] = useState<
    | {
        id: Banner['id'];
        mode: 'view' | 'edit';
      }
    | undefined
  >(undefined);
  const [searchTerm, setSearchTerm] = useState<string>('');

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
    defaultSize: 10,
  });

  const [getBannerApi, { data, isError, isLoading }] =
    useLazyGetBannersListQuery();

  const [deleteBannerApi] = useDeleteBannerMutation();

  const loadBanners = useCallback(async () => {
    await getBannerApi({
      expand: ['route', 'attraction'],
      size,
      page,
      search,
      filters: {
        ordering: '-created_dttm',
      },
    });
  }, [getBannerApi, page, search, size]);

  const attractionDiscounts = data?.data ? data.data.results : [];

  const handleCreateBanner = () => {
    setOpenDrawer(true);
  };

  const handleEditBanner = (id: AttractionDiscount['id']) => {
    setViewOrEditBanner({ mode: 'edit', id });
    setOpenDrawer(true);
  };

  const handleViewBanner = (id: AttractionDiscount['id']) => {
    setViewOrEditBanner({ mode: 'view', id });
    setOpenDrawer(true);
  };

  const handleDeleteBanner = async (id: Banner['id']) => {
    try {
      await deleteBannerApi({ id }).unwrap();
      loadBanners();
      toast.success('Баннер удален!');
    } catch (error) {
      console.error(error);
      toast.warn('Ошибка удаления баннера');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
    setViewOrEditBanner(undefined);
  };

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  useEffect(() => {
    if (data?.data) {
      setTotal(data.data.count);
      setPageCount(data.data.pageCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data]);

  if (isError)
    toast.error('Ошибка загрузки баннеров', {
      toastId: 'discounts_list_error',
    });

  return (
    <>
      <div className="flex items-center justify-between h-[48px]">
        <span className="text-3xl">Баннеры</span>
        <LocalButton disabled={isLoading} onClick={handleCreateBanner}>
          Добавить новый баннер
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

      {isLoading ? (
        <TablePreloader rowHeight={64} />
      ) : (
        <>
          <div className="grid grid-cols-12 bg-menu_dark rounded-t-3xl h-12 text-center border-b border-dark_stroke">
            <span className="col-span-3 flex items-center justify-center text-center border-r border-dark_stroke">
              Заголовок
            </span>
            <span className="col-span-3 flex items-center justify-center text-center border-r border-dark_stroke">
              Текст
            </span>
            <span className="col-span-3 flex items-center justify-center text-center border-r border-dark_stroke">
              Ссылка
            </span>
            <span className="col-span-3 flex items-center justify-center text-center">
              Баннер
            </span>
          </div>
          {attractionDiscounts.length ? (
            attractionDiscounts.map((d, i, arr) => (
              <div
                className={cn(
                  'grid min-h-[64px] grid-cols-12 bg-main_dark border-dark_stroke transition cursor-pointer hover:bg-menu_dark',
                  {
                    'rounded-b-3xl border-b': i === arr.length - 1,
                    'border-t': i !== 0,
                  },
                )}
                key={d.id}
                onClick={() => handleViewBanner(d.id)}
              >
                <span
                  className={cn(
                    'col-span-3 flex items-center justify-center text-center border-x border-dark_stroke',
                    { 'rounded-bl-3xl': i === arr.length - 1 },
                  )}
                >
                  {d.title ?? '-'}
                </span>
                <span className="col-span-3 flex items-center justify-center text-center border-r border-dark_stroke">
                  {d.subtitle ?? '-'}
                </span>
                <span className="col-span-3 flex items-center justify-center text-center border-r border-dark_stroke">
                  {!!d.routeId && `Маршрут - ${d.route.name}`}
                  {!!d.attractionId && `Объект - ${d.attraction.name}`}
                </span>
                <span
                  className={cn(
                    'col-span-3 flex gap-[10px] items-center justify-center text-center border-r border-dark_stroke',
                    { 'rounded-br-3xl': i === arr.length - 1 },
                  )}
                >
                  <LocalButton
                    variant="contained"
                    onClick={e => {
                      e.stopPropagation();
                      handleEditBanner(d.id);
                    }}
                  >
                    Редактировать
                  </LocalButton>
                  <LocalButton
                    variant="contained"
                    onClick={e => {
                      e.stopPropagation();
                      setConfirmDeleteId(d.id);
                    }}
                  >
                    Удалить
                  </LocalButton>
                </span>
              </div>
            ))
          ) : (
            <div className="mt-8 col-span-full flex justify-center">
              <span className="text-xl">Промокодов еще нет</span>
            </div>
          )}
          <TablePagination
            component="div"
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
        </>
      )}

      {openDrawer && (
        <BannerDrawer
          open={openDrawer}
          onSubmit={loadBanners}
          onClose={handleDrawerClose}
          bannerId={viewOrEditBanner?.id}
          mode={viewOrEditBanner?.mode}
        />
      )}

      {confirmDeleteId ? (
        <ConfirmationModal
          open={Boolean(confirmDeleteId)}
          onClose={() => setConfirmDeleteId(null)}
          onConfirm={() => handleDeleteBanner(confirmDeleteId)}
        />
      ) : null}
    </>
  );
};

export default Promo;
