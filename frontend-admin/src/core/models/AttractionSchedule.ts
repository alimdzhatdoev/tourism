import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import Attraction from './Attraction';

type WeekdayIds = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export enum WEEKDAYS_ENUM {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

const ruWeekdays: Record<WEEKDAYS_ENUM, string> = {
  Monday: 'понедельник',
  Tuesday: 'вторник',
  Wednesday: 'среда',
  Thursday: 'четверг',
  Friday: 'пятница',
  Saturday: 'суббота',
  Sunday: 'воскресенье',
};

export type AttractionScheduleExpand = Array<'attraction'>;

export type AttractionScheduleFilters = {
  ordering: string;
};

export default class AttractionSchedule extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;

  public fromTime: string | null = null;
  public tillTime: string | null = null;
  public weekDay: { id: WeekdayIds; label: WEEKDAYS_ENUM } = {
    id: 1,
    label: WEEKDAYS_ENUM.MONDAY,
  };
  public isFilled: boolean = false;
  public is24Hour: boolean = false;

  public attraction: Attraction = Attraction as any;
  public attractionId: Attraction['id'] = 0;

  public get hours() {
    if (!this.fromTime || !this.tillTime) return undefined;
    return `c ${this.fromTime.slice(0, 5)} до ${this.tillTime.slice(0, 5)}`;
  }

  public get fullLocalizedSchedule() {
    if (this.is24Hour) return 'Круглосуточно';
    if (this.fromTime && this.tillTime) {
      return `${this.ruWeekday}: c ${this.fromTime.slice(
        0,
        5,
      )} до ${this.tillTime.slice(0, 5)}`;
    }
    return undefined;
  }

  public get ruWeekday() {
    const wday = ruWeekdays[this.weekDay.label];
    return wday[0].toUpperCase() + wday.slice(1);
  }

  constructor(data: Partial<AttractionSchedule>) {
    super({ expand: true });

    this.update(data);
  }
}
