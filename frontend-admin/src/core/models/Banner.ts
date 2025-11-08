import { BaseModel } from 'sjs-base-model';
import Attraction from './Attraction';
import Creator from './Creator';
import Route from '@app/core/models/Route';

export interface BannersFilters {
  ordering: 'created_dttm' | '-created_dttm';
  search: string;
  page: number;
  size: number;
}

export type BannerExpand = Array<'attraction' | 'route'>;

export default class Banner extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;
  public title: string = '';
  public subtitle: string = '';
  public file: string | null = null;
  public fileBase64: string | null = null;
  public order: number = 0;
  public isActive: boolean = false;

  public route: Route = Route as any;
  public attraction: Attraction = Attraction as any;

  public routeId: Route['id'] = 0;
  public attractionId: Attraction['id'] = 0;

  public get entityName() {
    if (this.attraction.name) {
      return this.attraction.name;
    }
    if (this.route.name) {
      return this.route.name;
    }
    return null;
  }

  constructor(data: Partial<Banner>) {
    super({ expand: true });
    this.update(data);
  }
}
