import React, { FormEvent, memo, useCallback, useState } from 'react';
import {
  FormControl,
  InputBaseComponentProps,
  OutlinedInputProps,
} from '@mui/material';
import { Field, FieldInputProps, FieldProps } from 'formik';
import { TextField } from 'formik-mui';

interface Props {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  type?: React.InputHTMLAttributes<unknown>['type'];
  className?: string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  size?: 'small' | 'medium';
  InputProps?: Partial<OutlinedInputProps>;
  inputProps?: Partial<InputBaseComponentProps>;
  maxLenght?: number;
  helperText?: string;
  error?: boolean;
}

export const LocalInput: React.FC<Props> = memo(
  ({
    name,
    label,
    required,
    placeholder,
    type,
    className,
    multiline,
    rows,
    disabled,
    size,
    InputProps,
    inputProps,
    maxLenght,
    helperText,
    error = false,
  }) => {
    const [value, setValue] = useState<string>('');
    const inputRef = useCallback(
      (v?: string) => () => {
        if (v) setValue(v);
      },
      [],
    );
    const handleInputChange = useCallback(
      (onChange?: FieldInputProps<any>['onChange']) =>
        (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          if (
            maxLenght &&
            e.currentTarget.value.toString().length >= maxLenght
          ) {
            e.currentTarget.value = e.currentTarget.value.slice(0, maxLenght);
          }

          setValue(e.currentTarget.value);
          onChange?.(e);
        },
      [maxLenght],
    );
    return (
      <FormControl fullWidth className={className}>
        {label && <span className="text-xl mb-2.5">{label}</span>}
        <Field name={name}>
          {(props: FieldProps) => (
            <TextField
              fullWidth
              required={required}
              placeholder={placeholder}
              type={type}
              multiline={multiline}
              rows={rows}
              disabled={disabled}
              InputProps={InputProps}
              size={size}
              {...props}
              field={{
                ...props?.field,
                onChange: handleInputChange(props?.field?.onChange),
                value,
              }}
              inputProps={{
                ...inputProps,
                ref: inputRef(props?.field?.value),
              }}
              helperText={helperText}
              FormHelperTextProps={{
                sx: { color: error ? 'red' : undefined },
              }}
            />
          )}
        </Field>
      </FormControl>
    );
  },
);
