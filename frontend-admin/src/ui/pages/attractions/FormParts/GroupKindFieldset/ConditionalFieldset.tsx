import React, { FC, ChangeEvent, useCallback } from 'react';
import { Box, BoxProps, InputAdornment, TextField } from '@mui/material';
import { GroupKind } from '@app/core/models';
import { asx } from '@app/utils/sx';
import { LocalMultiSelect } from '@app/ui/components';
import { ATTRACTION_CUISINE_ENUM } from '@app/core/models/Attraction';
import { hideNumberControls } from '@app/constants/sx';
import { FormInterface } from '../FormParts.types';

interface ConditionalFieldsetProps extends BoxProps {
  groupKindNames?: Array<GroupKind['name']>;
}

export const ConditionalFieldset: FC<
  ConditionalFieldsetProps & FormInterface
> = ({ groupKindNames = [], setValue, values, ...containerProps }) => {
  const Container = useCallback(
    ({ children, ...props }: BoxProps) => (
      <Box
        {...containerProps}
        {...props}
        sx={[
          {
            display: 'grid',
            gap: '24px',
            gridTemplateColumns: 'repeat(3, 1fr)',
          },
          ...asx(containerProps?.sx),
          ...asx(props?.sx),
        ]}
      >
        {children}
      </Box>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValue(event.target.name, event.target.value);
  };

  return (
    <>
      {groupKindNames.includes('attraction') ? (
        <Container sx={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <TextField
            label="Как добраться"
            name="howToGet"
            value={values.howToGet}
            onChange={handleFieldChange}
            rows={5}
            multiline
          />
          <TextField
            label="Важно знать"
            name="mainDetails"
            value={values.mainDetails}
            onChange={handleFieldChange}
            rows={5}
            multiline
          />
          <TextField
            label="Цена билетов от"
            name="ticketPriceFrom"
            type="number"
            sx={hideNumberControls}
            value={values.ticketPriceFrom}
            onChange={handleFieldChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">₽</InputAdornment>,
            }}
          />
        </Container>
      ) : null}

      {groupKindNames.includes('hotel') ? (
        <Container sx={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <TextField
            label="Количество номеров"
            name="roomNumber"
            type="number"
            sx={hideNumberControls}
            value={values.roomNumber}
            onChange={handleFieldChange}
          />
          <TextField
            label="Минимальная цена"
            name="minPrice"
            type="number"
            sx={hideNumberControls}
            value={values.minPrice}
            onChange={handleFieldChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">₽</InputAdornment>,
            }}
          />
          <TextField
            label="Заезд"
            name="checkinTime"
            value={values.checkinTime}
            onChange={handleFieldChange}
          />
          <TextField
            label="Отъезд"
            name="checkoutTime"
            value={values.checkoutTime}
            onChange={handleFieldChange}
          />
        </Container>
      ) : null}

      {groupKindNames.includes('place') ? (
        <Container>
          <TextField
            label="Минимальная цена"
            name="minPrice"
            type="number"
            sx={hideNumberControls}
            value={values.minPrice}
            onChange={handleFieldChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">₽</InputAdornment>,
            }}
          />
        </Container>
      ) : null}

      {groupKindNames.includes('food') ? (
        <Container>
          <LocalMultiSelect
            label="Тип кухни"
            name="cuisineKind"
            options={Object.values(ATTRACTION_CUISINE_ENUM).map(kind => ({
              id: kind,
              label: kind,
              checked: !!values.cusineKind?.includes(kind),
            }))}
            onSelect={(value: string[]) => setValue('cuisineKind', value)}
          />
          <TextField
            label="Средний чек"
            name="averageCheck"
            type="number"
            sx={hideNumberControls}
            value={values.averageCheck}
            onChange={handleFieldChange}
            InputProps={{
              endAdornment: <InputAdornment position="end">₽</InputAdornment>,
            }}
          />
        </Container>
      ) : null}
    </>
  );
};
