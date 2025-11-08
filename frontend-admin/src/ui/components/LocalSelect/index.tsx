import { FormControl, MenuItem } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { TextField } from 'formik-mui';
import React, { memo } from 'react';

interface LocalSelectItem {
  value: string | number;
  text: string;
}

interface Props {
  name: string;
  label: string;
  items: Array<LocalSelectItem>;
  onSelect?: (
    value: LocalSelectItem['value'],
    text: LocalSelectItem['text'],
  ) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  value?: string | number;
}

export const LocalSelect: React.FC<Props> = memo(
  ({ name, items, label, onSelect, className, disabled, required }) => {
    if (!items?.length) return null;

    return (
      <FormControl fullWidth className={className}>
        <span className="text-xl mb-2.5">{label}</span>
        <Field
          size="medium"
          component={(props: FieldProps) => (
            <TextField {...props} select required={required} />
          )}
          onChange={(_: any, el: any) =>
            onSelect?.(el.props.value, el.props.children)
          }
          name={name}
          disabled={disabled}
        >
          {items.map(i => (
            <MenuItem key={i.value} value={i.value}>
              {i.text}
            </MenuItem>
          ))}
        </Field>
      </FormControl>
    );
  },
);
