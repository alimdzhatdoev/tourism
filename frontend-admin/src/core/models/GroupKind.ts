import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';

export default class GroupKind extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;

  public name: string = '';

  constructor(data: Partial<GroupKind>) {
    super({ expand: true });
    this.update(data);
  }
}
