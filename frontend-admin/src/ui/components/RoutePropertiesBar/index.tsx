import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { asx } from '@app/utils/sx';
import { LocalCheckbox } from '../LocalCheckbox/LocalCheckbox';
import RouteProperties from '@app/core/models/RouteProperties';

interface RoutePropertiesBarProps extends BoxProps {
  values: {
    season?: RouteProperties['season'];
    riseDegree?: RouteProperties['riseDegree'];
    isOvernight?: RouteProperties['isOvernight'];
    isFamily?: RouteProperties['isFamily'];
    isOnHorseback?: RouteProperties['isOnHorseback'];
    isOnFoot?: RouteProperties['isOnFoot'];
    isOnQuadBike?: RouteProperties['isOnQuadBike'];
    isOnCar?: RouteProperties['isOnCar'];
    isSwimming?: RouteProperties['isSwimming'];
  };
  setValue: (name: string, value: any) => void;
}

export const RoutePropertiesBar: React.FC<RoutePropertiesBarProps> = ({
  values,
  setValue,
  sx: containerSx,
  ...containerProps
}) => {
  return (
    <Box
      {...containerProps}
      sx={[
        { display: 'flex', width: '100%', gap: '20px' },
        ...asx(containerSx),
      ]}
    >
      <LocalCheckbox
        slotProps={{
          checkbox: {
            checked: !!values.isFamily,
            onChange: (_, isChecked) => setValue('isFamily', isChecked),
          },
          labelSpan: { children: 'Семейный' },
        }}
      />

      <LocalCheckbox
        slotProps={{
          checkbox: {
            checked: !!values.isOvernight,
            onChange: (_, isChecked) => setValue('isOvernight', isChecked),
          },
          labelSpan: { children: 'С ночёвкой' },
        }}
      />

      <LocalCheckbox
        slotProps={{
          checkbox: {
            checked: !!values.isOnHorseback,
            onChange: (_, isChecked) => setValue('isOnHorseback', isChecked),
          },
          labelSpan: { children: 'Верхом' },
        }}
      />

      <LocalCheckbox
        slotProps={{
          checkbox: {
            checked: !!values.isOnFoot,
            onChange: (_, isChecked) => setValue('isOnFoot', isChecked),
          },
          labelSpan: { children: 'Пеший' },
        }}
      />

      <LocalCheckbox
        slotProps={{
          checkbox: {
            checked: !!values.isOnQuadBike,
            onChange: (_, isChecked) => setValue('isOnQuadBike', isChecked),
          },
          labelSpan: { children: 'Квадроцикл' },
        }}
      />

      <LocalCheckbox
        slotProps={{
          checkbox: {
            checked: !!values.isOnCar,
            onChange: (_, isChecked) => setValue('isOnCar', isChecked),
          },
          labelSpan: { children: 'Автомобмиль' },
        }}
      />

      <LocalCheckbox
        slotProps={{
          checkbox: {
            checked: !!values.isSwimming,
            onChange: (_, isChecked) => setValue('isSwimming', isChecked),
          },
          labelSpan: { children: 'Можно поплавать' },
        }}
      />
    </Box>
  );
};
