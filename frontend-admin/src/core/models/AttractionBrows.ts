import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import Attraction from './Attraction';
import User from './User';

export type AttractionBrowsExpand = Array<'user' | 'attraction'>;

export default class AttractionBrows extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;

  public user: User = User as any;
  public attraction: Attraction = Attraction as any;

  public userId: User['id'] = 0;
  public attractionId: Attraction['id'] = 0;

  constructor(data: Partial<AttractionBrows>) {
    super({ expand: true });
    this.update(data);
  }
}
