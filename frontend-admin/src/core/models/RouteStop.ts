import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import Attraction from './Attraction';
import Route from './Route';

export type RouteStopExpand = Array<'attraction' | 'route'>;

export type RouteStopFilters = {
  route_id: Route['id'];
};

export default class RouteStop extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;
  public distanceToNext: number = 0;
  public order: number = 0;

  public attraction: Attraction = Attraction as any;
  public attractionId: Attraction['id'] = 0;
  public route: Route = Route as any;
  public routeId: Route['id'] = 0;

  constructor(data: Partial<RouteStop>) {
    super({ expand: true });
    this.update(data);
  }
}
