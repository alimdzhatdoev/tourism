import React, { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormControlLabelProps,
} from '@mui/material';
import * as cn from 'classnames';

interface LocalCheckboxProps
  extends Omit<FormControlLabelProps, 'slotProps' | 'label' | 'control'> {
  label?: FormControlLabelProps['label'];
  control?: FormControlLabelProps['control'];
  slotProps?: Partial<{
    checkbox: CheckboxProps;
    labelSpan: DetailedHTMLProps<
      HTMLAttributes<HTMLSpanElement>,
      HTMLSpanElement
    >;
  }> &
    FormControlLabelProps['slotProps'];
}

export const LocalCheckbox: FC<LocalCheckboxProps> = ({
  control,
  label,
  slotProps,
  ...props
}) => {
  return (
    <FormControlLabel
      control={control ?? <Checkbox {...slotProps?.checkbox} />}
      label={
        label ?? (
          <span
            {...slotProps?.labelSpan}
            className={cn('font-muller_medium', slotProps?.checkbox?.className)}
          />
        )
      }
      slotProps={{ typography: slotProps?.typography }}
      {...props}
    />
  );
};
