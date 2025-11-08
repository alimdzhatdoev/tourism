import React, { useEffect, useState } from 'react';
import { Pagination, PaginationProps } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

export const LocalPagination: React.FC<PaginationProps> = props => {
  const [params, setParams] = useSearchParams();
  const [pagination, setPagination] = useState(Number(params.get('page')) || 1);

  const handleChangePage = (_: React.ChangeEvent<unknown>, page: number) => {
    setPagination(page);
  };

  useEffect(() => {
    let localObject: { [x: string]: string } = {};
    for (let entry of params.entries()) {
      localObject = { ...localObject, [entry[0]]: entry[1] };
    }

    setParams(
      Object.assign(localObject, {
        page: pagination,
      }),
    );
  }, [pagination, params, setParams]);

  return (
    <Pagination
      hidePrevButton
      hideNextButton
      color="primary"
      shape="rounded"
      page={pagination}
      onChange={handleChangePage}
      {...props}
    />
  );
};
