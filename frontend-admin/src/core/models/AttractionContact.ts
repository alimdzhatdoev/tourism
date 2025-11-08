import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import Attraction from './Attraction';
import Contact from './Contact';

export type AttractionContactExpand = Array<'contact' | 'attraction'>;

export default class AttractionContact extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;

  public attraction: Attraction = Attraction as any;
  public contact: Contact = Contact as any;
  public attractionId: Attraction['id'] = 0;
  public contactId: Contact['id'] = 0;

  constructor(data: Partial<AttractionContact>) {
    super({ expand: true });
    this.update(data);
  }
}
