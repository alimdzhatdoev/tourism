import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import City from './City';
import Location from './Location';

export type RegionExpand = Array<'locations' | 'cities'>;

export default class Region extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;

  public region: string = '';
  public cities: Array<City> = [City as any];
  public locations: Array<Location> = [Location as any];

  constructor(data: Partial<Region>) {
    super({ expand: true });
    this.update(data);
  }
}
