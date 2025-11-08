import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import GroupKind from './GroupKind';
import Attraction from './Attraction';
import Subgroup from './Subgroup';

export type GroupExpand = Array<
  'attractions' | 'attractions__excursions' | 'subgroups' | 'kind'
>;

export default class Group extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;

  public name: string = '';
  public icon: string | null = null;
  public position: number | null = null;
  public kindId: GroupKind['id'] = 0;

  public attractions: Array<Attraction> = [Attraction as any];
  public subgroups: Array<Subgroup> = [Subgroup as any];
  public kind: GroupKind = GroupKind as any;
  public isUserCanContribute: boolean = false;

  constructor(data: Partial<Group>) {
    super({ expand: true });
    this.update(data);
  }
}
