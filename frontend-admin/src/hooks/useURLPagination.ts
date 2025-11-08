import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface InitialParams {
  defaultPage: number;
  defaultSize: number;
}

export const useURLPagination = (
  initial: InitialParams = { defaultSize: 20, defaultPage: 1 },
) => {
  const { defaultPage, defaultSize } = initial;
  const [total, setTotal] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);

  const [params, setParams] = useSearchParams();
  const paramsFromUrl = Array.from(params.entries())
    .filter(([key]) => key !== 'page' && key !== 'size')
    .reduce((o, [key, value]) => ({ ...o, [key]: value }), {});

  const pageFromQuery = params.get('page') ? Number(params.get('page')) : null;
  const sizeFromQuery = params.get('size') ? Number(params.get('size')) : null;

  const [pageState, setPageState] = useState<number>(
    pageFromQuery || defaultPage,
  );
  const [sizeState, setSizeState] = useState<number>(
    sizeFromQuery || defaultSize,
  );

  const setParamsStrings = (
    pageParam: string | number,
    sizeParam: string | number,
  ) => {
    setParams({
      ...paramsFromUrl,
      page: String(pageParam),
      size: String(sizeParam),
    });
  };

  const handlePaginationChange = (param: 'page' | 'size', value: number) => {
    if (value === 0) return;

    switch (param) {
      case 'page':
        setParamsStrings(value, sizeState);
        setPageState(value);
        break;
      case 'size':
        setParamsStrings(pageState, value);
        setSizeState(value);
        break;

      default:
        break;
    }
  };

  const checkEmptyParams = () => {
    if (!pageFromQuery) {
      setParamsStrings(defaultPage, sizeState);
      setPageState(defaultPage);
    } else if (sizeFromQuery || (sizeFromQuery && sizeFromQuery < 10)) {
      setParamsStrings(pageState, defaultSize);
      setSizeState(defaultSize);
    } else {
      setPageState(defaultPage);
      setSizeState(defaultSize);
      setParamsStrings(defaultPage, defaultSize);
    }
  };

  const handlePageCountSet = useCallback((count: number | undefined) => {
    if (!count) return;
    setPageCount(count);
  }, []);

  const handleTotalCountSet = useCallback((totalCount: number | undefined) => {
    if (!totalCount) return;
    setTotal(totalCount);
  }, []);

  useEffect(() => {
    checkEmptyParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    total,
    pageCount,
    page: pageState,
    size: sizeState,
    setTotal: handleTotalCountSet,
    setPageCount: handlePageCountSet,
    handlePaginationChange,
  };
};
