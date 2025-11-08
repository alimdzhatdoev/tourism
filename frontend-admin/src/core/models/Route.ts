import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import RouteKind from './RouteKind';
import RoutePhoto from './RoutePhoto';
import RouteReview from './RouteReview';
import RouteStop from './RouteStop';
import RouteTag from './RouteTag';
import { store } from '@app/core/store';
import UserFavouriteRoute from '@app/core/models/UserFavouriteRoute';
import Category from '@app/core/models/Category';
import RouteProperties, { RouteSeason } from './RouteProperties';

export type RouteExpand = Array<
  | 'stops'
  | 'stops__attraction'
  | 'stops__attraction__location'
  | 'stops__attraction__location__city__city'
  | 'stops__route'
  | 'stops__attraction__photos'
  | 'tags'
  | 'user_likes'
  | 'tags__tag'
  | 'tags__route'
  | 'reviews'
  | 'reviews__photos'
  | 'kind'
  | 'photos'
  | 'territory'
>;

export type RouteFilters = {
  /**
   * @example RouteTag['name'][].join(',')
   */
  tags__tag__name__in: string;
  stops__attraction__location__city__city: RouteStop['attraction']['location']['city']['city'];
  categories__category__name: Category['name'];
  /**
   * @example Category['name'][].join(',');
   */
  categories__category__name__in: string | null;
};

export enum ROUTE_STATUSES_ENUM {
  CREATION = 'CREATION',
  VERIFICATION = 'VERIFICATION',
  SUSPENSION = 'SUSPENSION',
  PUBLICATION = 'PUBLICATION',
}

export interface RouteCustomProperties {
  toTakeWithYou: null | Array<{ title: string; items: Array<string> }>;
  listDescription: null | Array<{ title: string; text: string }>;
}

export const ROUTE_SEASONS: Record<RouteSeason, string> = {
  all: 'Сезоны',
  autumn: 'Осень',
  spring: 'Весна',
  summer: 'Лето',
  winter: 'Зима',
};

export default class Route extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;
  public reviewCount: number = 0;
  public viewCount: number = 0;
  public likeCount: number = 0;
  public length: number = 0;
  /**
   * Route duration in minutes
   */
  public time: number = 0;
  public name: string = '';
  public userLikes: UserFavouriteRoute[] = [UserFavouriteRoute as any];
  public description: string = '';
  public totalDistance: number | null = null;
  public totalDuration: number | null = null;
  public difficulty: {
    id: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    label:
      | 'One'
      | 'Two'
      | 'Three'
      | 'Four'
      | 'Five'
      | 'Six'
      | 'Seven'
      | 'Eight'
      | 'Nine'
      | 'Ten';
  } = { id: 1, label: 'One' };
  public status: { id: ROUTE_STATUSES_ENUM; label: string } = {
    id: ROUTE_STATUSES_ENUM.SUSPENSION,
    label: ROUTE_STATUSES_ENUM.SUSPENSION.toLowerCase(),
  };
  public mainDetails: string | null = null;
  public rating: number | null = null;
  public publishedDttm: string | null = null;

  public stops: RouteStop[] = [RouteStop as any];
  public tags: RouteTag[] = [RouteTag as any];
  public reviews: RouteReview[] = [RouteReview as any];
  public photos: RoutePhoto[] = [RoutePhoto as any];

  public kind: RouteKind = RouteKind as any;
  public kindId: RouteKind['id'] = 0;

  public properties: RouteProperties | null = null;
  public customProperties: RouteCustomProperties | null = null;

  public get isFavouriteForUser() {
    if (!this.userLikes?.length) return false;
    const {
      user: { user },
    } = store.getState();
    const currentFavourite = this.userLikes.find(
      f => f.routeId === this.id && f.userId === user.id,
    );
    return currentFavourite ? true : false;
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

  public get lengthWithPostfix() {
    if (!this.length) return undefined;
    return `${Math.floor(this.length)} км`;
  }

  public get duration() {
    if (!this.time) return undefined;
    let hours = this.time / 60;
    const minutes = this.time % 60;
    return `${hours.toFixed()} ч ${minutes} мин`;
  }

  constructor(data: Partial<Route>) {
    super({ expand: true });
    this.update(data);
  }
}
