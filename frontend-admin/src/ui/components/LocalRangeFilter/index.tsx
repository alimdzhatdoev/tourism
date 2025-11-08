import React, { useEffect, useMemo, useState } from 'react';
import { FormControl, InputLabel, Select, Slider } from '@mui/material';
import cn from 'classnames';
import { useSearchParams } from 'react-router-dom';

type FilterProps = {
  label: string;
  field: string[];
  options: number[];
  classname?: string;
};

const marks = [1, 2, 3, 4, 5].map(value => ({
  value: value,
  label: String(value),
}));

export const LocalRangeFilter: React.FC<FilterProps> = ({
  options,
  classname,
  field,
  label,
}) => {
  const [values, setValues] = useState<number[]>([options[0], options[1]]);
  const [params, setParams] = useSearchParams();

  const paramsFromUrl = Array.from(params.entries())
    .filter(([key]) => key !== 'page' && key !== 'size')
    .reduce((o, [key, value]) => ({ ...o, [key]: value }), {});

  const handleChange = (_: Event, newValue: number | number[]) => {
    setValues(newValue as number[]);
  };

  useEffect(() => {
    let localObject: { [x: string]: string } = {};
    for (let entry of params.entries()) {
      localObject = { ...localObject, [entry[0]]: entry[1] };
    }

    if (options[0] === values[0] && options[1] === values[1]) {
      params.delete(field[0]);
      params.delete(field[1]);
      params.set('page', '1');
      setParams(params);
    } else {
      setParams({
        ...paramsFromUrl,
        ...Object.assign(localObject, {
          [field[0]]: values[0],
          [field[1]]: values[1],
          page: '1',
        }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const inputLabelText = useMemo(() => {
    let result: string = `${label}: все`;

    const minRating = params.get('min_rating');
    const maxRating = params.get('max_rating');

    if (minRating || maxRating) {
      result = `${label}: от ${minRating ?? 0} до ${maxRating ?? 5}`;
    }

    return result;
  }, [params, label]);

  return (
    <FormControl fullWidth>
      <InputLabel shrink={false}>{inputLabelText}</InputLabel>
      <Select
        variant="outlined"
        className={cn('w-full', classname)}
        sx={{ borderRadius: '10px', border: '0.5px solid black !important' }}
      >
        <div className="p-4 pt-6">
          <Slider
            valueLabelDisplay="auto"
            marks={marks}
            value={values}
            onChange={handleChange}
            step={0.5}
            min={options[0]}
            max={options[1]}
          />
        </div>
      </Select>
    </FormControl>
  );
};
