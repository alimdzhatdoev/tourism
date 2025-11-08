import {
  FormControl,
  MenuItem,
  Checkbox,
  Select,
  SelectChangeEvent,
} from '@mui/material';

import { Field } from 'formik';
import React, { memo, useState } from 'react';

interface LocalSelectItem {
  id: string | number;
  label: string;
}

interface Props {
  name: string;
  label: string;
  options: Array<LocalSelectItem>;
  onSelect?: (values: string[]) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export const LocalMultiSelect: React.FC<Props> = memo(
  ({ name, options, label, onSelect, className, disabled, required }) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const handleChange = (event: SelectChangeEvent<unknown>) => {
      const {
        target: { value },
      } = event;
      setSelectedOptions(
        typeof value === 'string' ? value.split(',') : (value as string[]),
      );
      onSelect?.(
        typeof value === 'string' ? value.split(',') : (value as string[]),
      );
    };
    if (!options?.length) return null;

    return (
      <FormControl fullWidth className={className}>
        <span className="text-xl mb-2.5">{label}</span>
        <Field name={name} value={selectedOptions} disabled={disabled}>
          {() => (
            <Select
              multiple
              value={selectedOptions}
              onChange={handleChange}
              renderValue={selected => (selected as string[]).join(', ')}
              required={required}
              sx={{ borderRadius: '10px' }}
            >
              {options.map(option => (
                <MenuItem key={option.id} value={option.label}>
                  <Checkbox
                    checked={selectedOptions.indexOf(option.label) > -1}
                  />
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
        </Field>
      </FormControl>
    );
  },
);
