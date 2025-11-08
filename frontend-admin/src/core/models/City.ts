import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import Region from './Region';
import Location from './Location';

export type CityExpand = Array<'locations'>;

export default class City extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;
  public city: string = '';
  public region: Region = Region as any;
  public regionId: Region['id'] = 0;
  public locations: Array<Location> = [Location as any];

  constructor(data: Partial<City>) {
    super({ expand: true });
    this.update(data);
  }
}
