import {BaseModel} from 'sjs-base-model'
import Creator from './Creator'
import Attraction from './Attraction'
import {Nullable} from 'types-helpers'

type WeekdayIds = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type WeekdayNames =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

type Weekday = {
  id: WeekdayIds
  label: WeekdayNames
}

export const RU_WEEKDAYS: Record<WeekdayNames, string> = {
  Monday: 'понедельник',
  Tuesday: 'вторник',
  Wednesday: 'среда',
  Thursday: 'четверг',
  Friday: 'пятница',
  Saturday: 'суббота',
  Sunday: 'воскресенье',
}

export type AttractionScheduleExpand = Array<'attraction'>

export type AttractionScheduleFilters = {
  ordering: string
}

export default class AttractionSchedule extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any

  public fromTime: Nullable<string> = null
  public tillTime: Nullable<string> = null
  public weekDay: Weekday = {
    id: 1,
    label: 'Monday',
  }
  public isFilled: boolean = false
  public is24Hour: boolean = false

  public attraction: Attraction = Attraction as any
  public attractionId: Attraction['id'] = 0

  constructor(data: Partial<AttractionSchedule>) {
    super({expand: true})
    this.update(data)
  }
}
