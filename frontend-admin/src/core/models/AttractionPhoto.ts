import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import Attraction from './Attraction';

export type AttractionPhotoExpand = Array<'attraction'>;

export default class AttractionPhoto extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;

  public file: string | null = null;
  public date: string | null = null;
  public comment: string | null = null;
  public order: number | null = null;
  public fileBase64: string | null = null;

  public attractionId: Attraction['id'] = 0;
  public attraction: Attraction = Attraction as any;

  constructor(data: Partial<AttractionPhoto>) {
    super({ expand: true });
    this.update(data);
  }
}
