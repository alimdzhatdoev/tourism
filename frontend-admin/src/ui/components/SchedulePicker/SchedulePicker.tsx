import React, { useCallback, useState } from 'react';
import { Formik, Form } from 'formik';
import { LocalButton } from '@app/ui/components';
import { Dialog } from '@mui/material';
import { Close } from '@mui/icons-material';
import AttractionSchedule, {
  WEEKDAYS_ENUM,
} from '@app/core/models/AttractionSchedule';
import { SchedulePickerInput } from './SchedulePickerInput';

interface Props {
  schedulesData: AttractionSchedule[];
  onPickSchedule: (schedules: AttractionSchedule[]) => void;
}

const defaultValues: AttractionSchedule[] = [
  new AttractionSchedule({
    weekDay: { id: 1, label: WEEKDAYS_ENUM.MONDAY },
  }),
  new AttractionSchedule({
    weekDay: { id: 2, label: WEEKDAYS_ENUM.TUESDAY },
  }),
  new AttractionSchedule({
    weekDay: { id: 3, label: WEEKDAYS_ENUM.WEDNESDAY },
  }),
  new AttractionSchedule({
    weekDay: { id: 4, label: WEEKDAYS_ENUM.THURSDAY },
  }),
  new AttractionSchedule({
    weekDay: { id: 5, label: WEEKDAYS_ENUM.FRIDAY },
  }),
  new AttractionSchedule({
    weekDay: { id: 6, label: WEEKDAYS_ENUM.SATURDAY },
  }),
  new AttractionSchedule({
    weekDay: { id: 7, label: WEEKDAYS_ENUM.SUNDAY },
  }),
];

export const SchedulePicker: React.FC<Props> = ({
  schedulesData,
  onPickSchedule,
}) => {
  const [openPickScheduleModal, setOpenPickScheduleModal] =
    useState<boolean>(false);

  const handleSubmitSchedules = useCallback(
    (values: AttractionSchedule[]) => {
      onPickSchedule(values);
      setOpenPickScheduleModal(false);
    },
    [onPickSchedule],
  );

  const scheduleValues = schedulesData.length
    ? defaultValues.map(defaultValue => {
        const weekdayValue = schedulesData.find(
          schedule => schedule.weekDay.id === defaultValue.weekDay.id,
        );

        return weekdayValue ? weekdayValue : defaultValue;
      })
    : defaultValues;

  return (
    <div className="flex flex-col">
      <span className="text-xl mb-2.5">График работы</span>
      <LocalButton
        variant="contained"
        type="button"
        className="text-start h-14 border border-main_grey"
        onClick={() => setOpenPickScheduleModal(true)}
      >
        {schedulesData.length ? 'Изменить' : 'Добавить'}
      </LocalButton>
      <Dialog
        open={openPickScheduleModal}
        onClose={() => setOpenPickScheduleModal(false)}
        PaperProps={{
          style: {
            borderRadius: 24,
          },
        }}
      >
        <div className="flex flex-col w-[390px] bg-main_dark px-5 font-muller_regular">
          <div className="flex items-center justify-between py-[22px] border-b border-dark_stroke">
            <span className="text-xl">График работы</span>
            <LocalButton
              asIcon
              variant="contained"
              className="w-6 h-6 rounded-full border-main_grey border"
              onClick={() => setOpenPickScheduleModal(false)}
            >
              <Close fontSize="small" />
            </LocalButton>
          </div>
          <Formik
            enableReinitialize
            initialValues={scheduleValues}
            onSubmit={handleSubmitSchedules}
          >
            {({ handleSubmit }) => (
              <Form>
                <div className="flex flex-col pt-5 pb-[152px] border-b border-dark_stroke">
                  {scheduleValues.map(schedule => (
                    <SchedulePickerInput
                      className="py-2"
                      key={schedule.weekDay.id}
                      weekDayIndex={schedule.weekDay.id - 1}
                      weekDayLabel={schedule.ruWeekday}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-end py-5">
                  <LocalButton
                    className="h-9"
                    type="submit"
                    onClick={() => handleSubmit}
                  >
                    Сохранить
                  </LocalButton>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Dialog>
    </div>
  );
};
