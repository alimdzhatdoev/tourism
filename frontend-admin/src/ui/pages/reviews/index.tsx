import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { InputAdornment, TablePagination, TextField } from '@mui/material';
import { useLazyGetAttractionReviewsListQuery } from '@app/core/store/attraction_reviews';
import { AttractionReviewsTable, TablePreloader } from '@app/ui/components';
import { useDebounce, useURLPagination } from '@app/hooks';
import { MagnifyingGlassIcon } from '@app/assets/icons';

const Reviews: React.FC = () => {
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

  const [getAttractionReviewsApi, { data, isError, isLoading }] =
    useLazyGetAttractionReviewsListQuery({});

  const reviews = data?.data ? data.data.results : [];

  const loadAttractionReviews = useCallback(async () => {
    await getAttractionReviewsApi({
      page,
      size,
      search,
      expand: [
        'photos',
        'attraction',
        'attraction__categories__category',
        'attraction__location__region',
        'attraction__location__city',
      ],
      filters: {
        ordering: '-created_dttm',
      },
    });
  }, [getAttractionReviewsApi, page, size, search]);

  useEffect(() => {
    loadAttractionReviews();
  }, [loadAttractionReviews]);

  useEffect(() => {
    if (data?.data) {
      setTotal(data.data.count);
      setPageCount(data.data.pageCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data]);

  if (isError)
    toast.error('Ошибка загрузки отзывов', {
      toastId: 'reviews_list_error',
    });

  const PaginationComponent = useMemo(
    () => (
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
    ),
    [handlePaginationChange, page, pageCount, size, total],
  );

  return (
    <div>
      <div className="flex items-center justify-between h-11">
        <span className="text-3xl">Отзывы</span>
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

      {isLoading && !reviews.length ? (
        <TablePreloader />
      ) : (
        <AttractionReviewsTable
          reviews={reviews}
          PaginationComponent={PaginationComponent}
        />
      )}
    </div>
  );
};

export default Reviews;
