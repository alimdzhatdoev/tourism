import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';

export enum CATEGORIES_ENUM {
  MOUNTAINS = 'mountains',
  CHURCH = 'church',
  RIVERS = 'rivers',
  WATERFALLS = 'waterfall',
  LAKES = 'lakes',
  OTHER = 'other',
}

export const ENG_CATEGORY: Record<CATEGORIES_ENUM, string> = {
  [CATEGORIES_ENUM.MOUNTAINS]: 'Горы',
  [CATEGORIES_ENUM.CHURCH]: 'Храмы',
  [CATEGORIES_ENUM.RIVERS]: 'Реки',
  [CATEGORIES_ENUM.WATERFALLS]: 'Водопады',
  [CATEGORIES_ENUM.LAKES]: 'Озера',
  [CATEGORIES_ENUM.OTHER]: 'Прочее',
};

export type CategoryExpand = Array<'attractions'>;

export default class Category extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;
  public name: CATEGORIES_ENUM = CATEGORIES_ENUM.OTHER;
  public logo: string | null = null;

  constructor(data: Partial<Category>) {
    super({ expand: true });
    this.update(data);
  }
}
