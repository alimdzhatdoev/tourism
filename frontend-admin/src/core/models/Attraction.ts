import { BaseModel } from 'sjs-base-model';
import { store } from '@app/core/store';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import Creator from './Creator';
import Location from './Location';
import AttractionCategory from './AttractionCategory';
import AttractionPhoto from './AttractionPhoto';
import AttractionSchedule from './AttractionSchedule';
import Route from './Route';
import UserFavouriteAttraction from './UserFavouriteAttraction';
import AttractionPromotion from './AttractionPromotion';
import AttractionCall from './AttractionCall';
import AttractionBrows from './AttractionBrows';
import AttractionContact from './AttractionContact';
import AttractionDiscount from './AttractionDiscount';
import AttractionReview from './AttractionReview';
import Category from './Category';
import User from './User';
import Excursion from './Excursion';
import Group from './Group';
import Subgroup from './Subgroup';

dayjs.extend(isoWeek);

export type AttractionExpand = Array<
  | 'categories'
  | 'categories__category'
  | 'location'
  | 'location__region'
  | 'location__city'
  | 'photos'
  | 'schedules'
  | 'routes'
  | 'users_favourite'
  | 'promotions'
  | 'promotions__payment'
  | 'promotions__promotion'
  | 'user_calls'
  | 'user_calls__user'
  | 'user_views'
  | 'user_views__user'
  | 'discounts'
  | 'discounts__discount'
  | 'contacts'
  | 'contacts__contact'
  | 'contacts__contact__kind'
  | 'reviews'
  | 'reviews__photos'
  | 'excursions'
  | 'groups'
  | 'subgroups'
>;

export enum ATTRACTION_STATUSES_ENUM {
  CREATION = 'CREATION',
  PUBLISHED = 'PUBLISHED',
  ARCHIVE = 'ARCHIVE',
}

export const ATTRACTION_STATUSES_RU: Record<ATTRACTION_STATUSES_ENUM, string> =
  {
    [ATTRACTION_STATUSES_ENUM.CREATION]: 'На рассмотрении',
    [ATTRACTION_STATUSES_ENUM.PUBLISHED]: 'Опубликованы',
    [ATTRACTION_STATUSES_ENUM.ARCHIVE]: 'В архиве',
  };

export enum ATTRACTION_CUISINE_ENUM {
  ASIAN = 'Азиатская',
  EUROPEAN = 'Европейская',
  CHINESE = 'Китайская',
  ITALIAN = 'Итальянская',
}

export interface AttractionsFilters {
  categories__category__name: Category['name'];
  /**
   * @example Category['name'][].join(',');
   */
  categories__category__name__in: string | null;
  created_by__id: User['id'];
  location__city__city: Location['city']['city'];
  ordering: 'created_dttm' | '-created_dttm';
  min_rating: string;
  max_rating: string;
  /**
   * @example Attraction['status'][].join(',');
   */
  status__in: string | null;
  /**
   * @example Location['city']['city'][].join(',');
   */
  location__city__city__in: string | null;
  is_user_added: Attraction['isUserAdded'];
  location__region_id: Location['region']['id'];
  location__city_id: Location['city']['id'];
  group_id: Attraction['groups'][number]['id'];
  subgroup_id: string;
}

export default class Attraction extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;
  public name: string = '';
  public reviewCount: number = 0;
  public likes: number = 0;
  public views: number = 0;
  public calls: number = 0;
  public containedRoutes: number = 0;
  public isRecommended: boolean = false;
  public isPromoting: boolean = false;
  public isUserAdded: boolean = false;
  public isViewed: true | null = null;
  public status: { id: ATTRACTION_STATUSES_ENUM; label: string } = {
    id: ATTRACTION_STATUSES_ENUM.ARCHIVE,
    label: ATTRACTION_STATUSES_ENUM.ARCHIVE.toLowerCase(),
  };
  public distance: number | null = null;
  public rating: number | null = null;
  public description: string | null = null;
  public howToGet: string | null = null;
  public mainDetails: string | null = null;
  public audioGuid: string | null = null;
  public averageCheck: number | null = null;
  public cuisineKind: string | null = null;
  public minPrice: number | null = null;
  public roomNumber: number | null = null;
  public checkinTime: string | null = null;
  public checkoutTime: string | null = null;
  public ticketPriceFrom: number | null = null;
  public publishedDttm: string | null = null;

  public location: Location = Location as any;
  public locationId: Location['id'] = 0;

  /**
   * @return if @param expand provided
   * @default undefined
   */
  public categories: AttractionCategory[] = [AttractionCategory as any];
  public photos: AttractionPhoto[] = [AttractionPhoto as any];
  public schedules: AttractionSchedule[] = [AttractionSchedule as any];
  public routes: Route[] = [Route as any];
  public usersFavourite: UserFavouriteAttraction[] = [
    UserFavouriteAttraction as any,
  ];
  public promotions: AttractionPromotion[] = [AttractionPromotion as any];
  public userCalls: AttractionCall[] = [AttractionCall as any];
  public userViews: AttractionBrows[] = [AttractionBrows as any];
  public contacts: AttractionContact[] = [AttractionContact as any];
  public discounts: AttractionDiscount[] = [AttractionDiscount as any];
  public reviews: AttractionReview[] = [AttractionReview as any];
  public minExcursionPrice: number | null = null;
  public excursions: Excursion[] = [Excursion as any];
  public groups: Array<Group> = [];
  public subgroups: Array<Subgroup> = [];

  constructor(data: Partial<Attraction>) {
    super({ expand: true });

    this.update(data);
  }

  public get groupKindBasedFields() {
    return {};
  }

  public get declentedReviewCount() {
    if (!this.reviewCount) return 'Нет оценок';
    const num = Math.abs(this.reviewCount);
    const count = num % 10;
    if (num > 10 && num < 20) return `${this.reviewCount} оценок`;
    if (count > 1 && count < 5) return `${this.reviewCount} оценки`;
    if (count === 1) return `${this.reviewCount} оценка`;
    return `${this.reviewCount} оценок`;
  }

  public get todayOpenTime() {
    if (!this.schedules.length) return 'Нет графика работы';
    const todayWeekday = dayjs().isoWeekday();
    const currentSchedule = this.schedules.find(
      s => typeof s !== 'number' && s.weekDay.id === todayWeekday,
    ) as AttractionSchedule;
    if (currentSchedule) return `Открыто ${currentSchedule.hours}`;
    return 'Закрыто';
  }

  public get isFavouriteForUser() {
    if (!this.usersFavourite?.length) return false;
    const {
      user: { user },
    } = store.getState();
    const currentFavourite = this.usersFavourite.find(
      f => f.attractionId === this.id && f.userId === user.id,
    );
    return currentFavourite ? true : false;
  }

  public getContactValue(type: 'email' | 'phone' | 'website') {
    const contact = this.contacts.find(c => c.contact.kind.name === type);
    if (!contact) return undefined;
    return contact.contact.value;
  }

  public getContactId(type: 'email' | 'phone' | 'website') {
    const contact = this.contacts.find(c => c.contact.kind.name === type);
    if (!contact) return undefined;
    return contact.contact.id;
  }

  public get actualDiscount() {
    const active = this.discounts.find(d => d.attractionId === this.id);
    if (active && active.discount.isPercent)
      return active.promocode
        ? `${active.promocode} - ${active.discount.percentValue}%`
        : `${active.discount.percentValue}%`;
    if (active && !active.discount.isPercent)
      return active.promocode
        ? `${active.promocode} - ${active.discount.currencyValue} руб.`
        : `${active.discount.currencyValue} руб.`;
    return undefined;
  }

  public get isPublished() {
    return this.status.id === ATTRACTION_STATUSES_ENUM.PUBLISHED;
  }

  public get cover() {
    if (!this.photos?.length) return undefined;

    const photosWithFile = this.photos.filter(p => p.file);
    if (!photosWithFile.length) return undefined;

    const cover = photosWithFile.find(p => p.order === 0)?.file;
    if (!cover) return photosWithFile[0].file!;
    return cover;
  }
}
