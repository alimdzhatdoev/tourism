import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';

export default class RouteKind extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;

  public name: string = '';
  public averageSpeed: number = 0;

  constructor(data: Partial<RouteKind>) {
    super({ expand: true });
    this.update(data);
  }
}
