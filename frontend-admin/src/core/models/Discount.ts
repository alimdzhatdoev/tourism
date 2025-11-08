import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import AttractionDiscount from './AttractionDiscount';

export type DiscountExpand = Array<
  'attractions' | 'attractions__attraction' | 'attractions__discount'
>;

export default class Discount extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;
  public isPercent: boolean = false;

  public percentValue: number | null = null;
  public currencyValue: number | null = null;

  public attractions: AttractionDiscount[] = [AttractionDiscount as any];

  constructor(data: Partial<Discount>) {
    super({ expand: true });
    this.update(data);
  }
}
