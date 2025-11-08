import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import Excursion from './Excursion';
import ExcursionTime from './ExcursionTime';

export type ExcursionDateExpand = 'times'[];

export default class ExcursionDate extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;
  public date: string = '';
  public excursion: Excursion = Excursion as any;
  public excursionId: Excursion['id'] | null = null;
  public minPrice: number | null = null;
  public times: ExcursionTime[] = [ExcursionTime as any];

  constructor(data: Partial<ExcursionDate>) {
    super({ expand: true });
    this.update(data);
  }
}
