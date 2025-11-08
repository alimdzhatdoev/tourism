import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';

export default class Promotion extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;

  public name: string = '';
  public dayLimit: number = 0;
  public description: string | null = null;

  constructor(data: Partial<Promotion>) {
    super({ expand: true });
    this.update(data);
  }
}
