import React from 'react';
import { Autocomplete, styled, TextField } from '@mui/material';
import { getTimeSlots } from '@app/utils/getTimeSlots';
import { ArrowOutlinedIcon } from '@app/assets/icons';
import cn from 'classnames';
import { Field, FieldProps } from 'formik';

const StyledAutocomplete = styled(Autocomplete)(() => ({
  [`& .MuiInputBase-root`]: {
    height: 32,
    minWidth: 81,
    fontSize: 14,
  },

  [`&.MuiAutocomplete-hasPopupIcon .MuiOutlinedInput-root`]: {
    paddingRight: 20,
  },
}));

interface Props {
  weekDayIndex: number;
  weekDayLabel: string;
  timeInterval?: number;
  className?: string;
}

export const SchedulePickerInput: React.FC<Props> = ({
  weekDayIndex,
  weekDayLabel,
  timeInterval = 30,
  className,
}) => {
  const timeOptions = getTimeSlots(timeInterval);

  return (
    <div className={(cn('flex items-center justify-between'), className)}>
      <div className="min-w-full flex items-center justify-between">
        <span className="text-xl">{weekDayLabel}</span>
        <div className="flex items-center">
          <Field name="fromTime">
            {({ form: { values, setFieldValue } }: FieldProps) => (
              <StyledAutocomplete
                id="fromTime"
                options={timeOptions}
                value={values[weekDayIndex].fromTime}
                popupIcon={
                  <ArrowOutlinedIcon
                    className="my-2"
                    width={10}
                    height={10}
                    direction="bottom"
                  />
                }
                disableClearable
                renderInput={params => <TextField {...params} size="small" />}
                onChange={(_, v) =>
                  setFieldValue(`${weekDayIndex}.fromTime`, v)
                }
              />
            )}
          </Field>
          <span className="px-2">-</span>
          <Field name="fromTime">
            {({ form: { values, setFieldValue } }: FieldProps) => (
              <StyledAutocomplete
                id="tillTime"
                options={timeOptions}
                value={values[weekDayIndex].tillTime}
                popupIcon={
                  <ArrowOutlinedIcon
                    className="my-2"
                    width={10}
                    height={10}
                    direction="bottom"
                  />
                }
                disableClearable
                renderInput={params => <TextField {...params} size="small" />}
                onChange={(_, v) =>
                  setFieldValue(`${weekDayIndex}.tillTime`, v)
                }
              />
            )}
          </Field>
        </div>
      </div>
    </div>
  );
};
