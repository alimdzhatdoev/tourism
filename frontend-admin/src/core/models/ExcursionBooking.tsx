import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import ExcursionTime from './ExcursionTime';

export type ExcursionBookingExpand =
  Array<'excursion_time__excursion_date__excursion__attraction'>;

export interface ExcursionBookingFilters {
  ordering: string | null;
}

export default class ExcursionBooking extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;
  public date: string = '';
  public time: string = '';
  public price: number = 0;
  public visitors: number = 0;
  public totalPrice: number = 0;
  public comment: string | null = null;
  public excursionTime: ExcursionTime = ExcursionTime as any;
  public excursionTimeId: ExcursionTime['id'] | null = null;

  constructor(data: Partial<ExcursionBooking>) {
    super({ expand: true });
    this.update(data);
  }
}
