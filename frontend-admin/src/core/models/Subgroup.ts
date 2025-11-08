import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import Group from './Group';
import Attraction from './Attraction';

export type SubgroupsExpand = Array<'attractions__excursions' | 'groups'>;

export default class Subgroup extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;

  public name: string = '';
  public icon: string | null = null;
  public position: number | null = null;
  public group: Group = Group as any;
  public groupId: Group['id'] = 0;
  public attractions: Array<Attraction> = [Attraction as any];

  constructor(data: Partial<Subgroup>) {
    super({ expand: true });
    this.update(data);
  }
}
