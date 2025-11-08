import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import Route from './Route';
import Tag from './Tag';

export type RouteTagExpand = ReadonlyArray<'route' | 'tag'>;

export default class RouteTag extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;

  public route: Route = Route as any;
  public routeId: Route['id'] = 0;
  public tag: Tag = Tag as any;
  public tagId: Tag['id'] = 0;

  constructor(data: Partial<RouteTag>) {
    super({ expand: true });
    this.update(data);
  }
}
