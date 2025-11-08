import { BaseModel } from 'sjs-base-model';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import relativeTime from 'dayjs/plugin/relativeTime';
import Creator from './Creator';
import Attraction from './Attraction';
import AttractionReviewPhoto from './AttractionReviewPhoto';

dayjs.extend(relativeTime);
dayjs.locale('ru');

export type AttractionReviewExpand = Array<
  | 'attraction'
  | 'photos'
  | 'attraction__categories__category'
  | 'attraction__location__region'
  | 'attraction__location__city'
>;

export type AttractionReviewFilters = {
  attraction: Attraction['id'];
  ordering: 'created_dttm' | '-created_dttm'; // TODO other strings
};

export default class AttractionReview extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;
  public starRate: {
    id: 1 | 2 | 3 | 4 | 5;
    label: 'One' | 'Two' | 'Three' | 'Four' | 'Five';
  } = { id: 1, label: 'One' };
  public text: string | null = null;

  public attraction: Attraction = Attraction as any;
  public attractionId: Attraction['id'] = 0;

  public photos: AttractionReviewPhoto[] = [AttractionReviewPhoto as any];

  public get relatedTimeAgo() {
    return dayjs(this.createdDttm).locale('ru').fromNow();
  }

  public get isJustMark() {
    return !this.text && !this.photos.length;
  }

  constructor(data: Partial<AttractionReview>) {
    super({ expand: true });
    this.update(data);
  }
}
