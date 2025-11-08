import { BaseModel } from 'sjs-base-model';
import City from './City';
import Creator from './Creator';
import Region from './Region';

export default class RegionCity extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;

  public region: Region = Region as any;
  public regionId: Region['id'] = 0;
  public city: City = City as any;
  public cityId: City['id'] = 0;

  constructor(data: Partial<RegionCity>) {
    super({ expand: true });
    this.update(data);
  }
}
