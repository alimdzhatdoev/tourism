import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import User from './User';
import Attraction from './Attraction';

export type UserFavRouteExpand = Array<
  | 'user'
  | 'route'
  | 'route__photos'
  | 'route__location'
  | 'route__location__region'
  | 'route__location__city'
  | 'route__categories__category'
  | 'route__users_favourite'
>;

export default class UserFavouriteRoute extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;

  public route: Attraction = Attraction as any;
  public user: User = User as any;

  public routeId: Attraction['id'] = 0;
  public userId: User['id'] = 0;

  constructor(data: Partial<UserFavouriteRoute>) {
    super({ expand: true });
    this.update(data);
  }
}
