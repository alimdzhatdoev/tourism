import React, { FC, useEffect, useMemo, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import cn from 'classnames';

type LocalFiltersOption = {
  label: string;
  id: number | string;
};

type FilterProps<T = LocalFiltersOption> = {
  label: string;
  field: string;
  options: T[];
  classname?: string;
  optionNameExtractor?: (option: T) => string;
};

export const LocalFilters: FC<FilterProps> = ({
  options,
  label,
  classname,
  field,
  optionNameExtractor = option => option.id,
}) => {
  const [params, setParams] = useSearchParams();

  const paramsFromUrl = Array.from(params.entries())
    .filter(([key]) => key !== 'page' && key !== 'size')
    .reduce((o, [key, value]) => ({ ...o, [key]: value }), {});

  const getInitialFilters = () => {
    let finishedArray: LocalFiltersOption[] = [];

    for (let entry of params.entries()) {
      if (field === entry[0]) {
        finishedArray = entry[1].split(',').map(localId => ({
          label:
            options.find(
              opt => opt.id === Number(localId) || opt.id === localId,
            )?.label ?? '',
          id: Number(localId) || localId,
        }));
      }
    }

    return finishedArray as typeof options;
  };

  const [filters, setFilters] = useState<typeof options[0][]>(
    getInitialFilters(),
  );

  useEffect(() => {
    let localObject: { [x: string]: string } = {};
    for (let entry of params.entries()) {
      localObject = { ...localObject, [entry[0]]: entry[1] };
    }

    if (filters.length === 0) {
      params.delete(field);
      params.set('page', '1');
      setParams(params);
    } else {
      setParams({
        ...paramsFromUrl,
        ...Object.assign(localObject, {
          [field]: filters.map(({ id }) => id).join(','),
          page: '1',
        }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, field]);

  const inputValue = useMemo(() => {
    let result: string = `${label}: все`;

    if (filters.length > 0) {
      const filterNames = filters.map(f => optionNameExtractor(f)).join(', ');
      result = `${label}: ${filterNames}`;
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, label]);

  const handleChangeFilters = (
    _: React.SyntheticEvent,
    arrayOption: typeof options | null,
  ) => {
    setFilters(arrayOption!);
  };

  return (
    <Autocomplete
      className={cn('w-full', classname)}
      multiple
      disableCloseOnSelect
      openOnFocus
      getOptionLabel={option => option.label}
      filterOptions={filterOptions => filterOptions}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderTags={() => <></>}
      inputValue={inputValue}
      options={options}
      title={inputValue}
      renderInput={props => {
        return <TextField {...props} size="medium" />;
      }}
      onChange={handleChangeFilters}
      value={filters}
    />
  );
};
