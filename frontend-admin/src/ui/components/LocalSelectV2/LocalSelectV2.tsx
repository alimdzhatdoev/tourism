import React, { FC, SyntheticEvent } from 'react';
import {
  FormControl,
  FormControlProps,
  InputLabel,
  InputLabelProps,
  Select,
  SelectProps,
} from '@mui/material';
import { asx } from '@app/utils/sx';

declare const document: { activeElement?: { blur?: () => void } };

export interface LocalSelectV2tProps extends Omit<SelectProps, 'slotProps'> {
  slotProps?: //  SelectProps['slotProps'] &
  {
    formControl: Partial<FormControlProps>;
    inputLabel: Partial<InputLabelProps>;
    selectSx: SelectProps['sx'];
  };
}

export const LocalSelectV2: FC<LocalSelectV2tProps> = ({
  sx,
  label,
  children,
  onClose,
  value,
  slotProps,
  ...props
}) => {
  const handleClose = (event: SyntheticEvent<Element, Event>) => {
    onClose?.(event);
    setTimeout(() => {
      document.activeElement?.blur?.();
    }, 0);
  };
  return (
    <FormControl
      {...slotProps?.formControl}
      sx={[{ flex: 1 }, ...asx(sx), ...asx(slotProps?.formControl?.sx)]}
    >
      <InputLabel {...slotProps?.inputLabel}>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onClose={handleClose}
        sx={slotProps?.selectSx}
        // slotProps={{
        //   input: slotProps?.input,
        //   root: {
        //     ...slotProps?.root,
        //     style: {
        //       backgroundColor: 'rgb(34, 37, 46)',
        //       ...slotProps?.root?.style,
        //     },
        //   },
        // }}
        {...props}
      >
        {children}
      </Select>
    </FormControl>
  );
};
