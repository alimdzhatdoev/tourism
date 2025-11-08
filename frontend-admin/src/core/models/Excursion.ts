import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import Attraction from './Attraction';
import ExcursionDate from './ExcursionDate';
import Route from './Route';

export type ExcursionExpand = Array<
  'schedule_dates' | 'schedule_dates__times' | 'attraction' | 'route'
>;

export interface ExcursionsFilters {
  is_active: boolean;
  ordering: string | null;
}

export default class Excursion extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;
  public isActive: boolean = false;
  public attraction: Attraction = Attraction as any;
  public attractionId: Attraction['id'] | null = null;
  public route: Route = Route as any;
  public routeId: Route['id'] | null = null;
  public scheduleDates: ExcursionDate[] = [ExcursionDate as any];

  constructor(data: Partial<Excursion>) {
    super({ expand: true });
    this.update(data);
  }
}
