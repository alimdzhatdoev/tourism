import {BaseModel} from 'sjs-base-model'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import Creator from './Creator'
import Location from './Location'
import AttractionCategory from './AttractionCategory'
import AttractionPhoto from './AttractionPhoto'
import AttractionSchedule from './AttractionSchedule'
import Route from './Route'
import UserFavouriteAttraction from './UserFavouriteAttraction'
import AttractionPromotion from './AttractionPromotion'
import AttractionCall from './AttractionCall'
import AttractionBrows from './AttractionBrows'
import AttractionContact from './AttractionContact'
import AttractionDiscount from './AttractionDiscount'
import AttractionReview from './AttractionReview'
import Category from './Category'
import User from './User'
import Excursion from './Excursion'
import {
  ExcursionTileProps,
  PlaceTileProps,
  ReviewTileProps,
} from '@/ui/components/_tiles'
import {Nullable} from 'types-helpers'
import {BannerItemProps, RatingProps} from '@/ui/components'
import {PlaceIconProps} from '@/ui/components/_map-icons'
import {dateTimeFormats} from '@/constants'
import {GuideTileProps} from '@/ui/components/_tiles/GuideTile'
import Group from './Group'

dayjs.extend(isoWeek)

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
>

export type AttractionStatusIds = 'CREATION' | 'PUBLISHED' | 'ARCHIVE'

export type AttractionStatus = {
  id: AttractionStatusIds
  label: string
}

export const RU_ATTRACTION_STATUS_IDS: Record<AttractionStatusIds, string> = {
  ARCHIVE: 'В архиве',
  CREATION: 'На рассмотрении',
  PUBLISHED: 'Размещен',
}

export interface AttractionsFilters {
  categories__category__name: Category['name']
  /**
   * @example Category['name'][].join(',');
   */
  categories__category__name__in: string | null
  created_by__id: User['id']
  location__city__city: Location['city']['city']
  ordering: 'created_dttm' | '-created_dttm'
  min_rating: string
  max_rating: string
  /**
   * @example Attraction['status'][].join(',');
   */
  status__in: string | null
  /**
   * @example Location['city']['city'][].join(',');
   */
  location__city__city__in: string | null
  is_user_added: Attraction['isUserAdded']
  location__region_id: string
  location__city_id: string
  group_id: string
  subgroup_id: string
  is_favorite: boolean
}

export default class Attraction extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any
  public name: string = ''
  public reviewCount: number = 0
  public likes: number = 0
  public views: number = 0
  public calls: number = 0
  public containedRoutes: number = 0
  public isRecommended: boolean = false
  public isPromoting: boolean = false
  public isUserAdded: boolean = false
  public isViewed: Nullable<true> = null
  public status: AttractionStatus = {
    id: 'ARCHIVE',
    label: 'archive',
  }

  public distance: Nullable<number> = null
  public rating: Nullable<number> = null
  public description: Nullable<string> = null
  public howToGet: Nullable<string> = null
  public mainDetails: Nullable<string> = null
  public audioGuid: Nullable<string> = null
  public averageCheck: Nullable<number> = null
  public cuisineKind: Nullable<string> = null
  public minPrice: Nullable<number> = null
  public roomNumber: number | null = null
  public checkinTime: Nullable<string> = null
  public checkoutTime: Nullable<string> = null
  public ticketPriceFrom: Nullable<number> = null
  public publishedDttm: Nullable<string> = null

  public location: Location = Location as any
  public locationId: Location['id'] = 0

  public categories: AttractionCategory[] = [AttractionCategory as any]
  public photos: AttractionPhoto[] = [AttractionPhoto as any]
  public schedules: AttractionSchedule[] = [AttractionSchedule as any]
  public routes: Route[] = [Route as any]
  public usersFavourite: UserFavouriteAttraction[] = [
    UserFavouriteAttraction as any,
  ]
  public promotions: AttractionPromotion[] = [AttractionPromotion as any]
  public userCalls: AttractionCall[] = [AttractionCall as any]
  public userViews: AttractionBrows[] = [AttractionBrows as any]
  public contacts: AttractionContact[] = [AttractionContact as any]
  public discounts: AttractionDiscount[] = [AttractionDiscount as any]
  public reviews: AttractionReview[] = [AttractionReview as any]
  public minExcursionPrice: number | null = null
  public excursions: Excursion[] = [Excursion as any]
  public groups: Group[] = [Group as any]
  public isFavorite: boolean = false

  public get mainImage() {
    if (this.photos.length > 0) {
      return this.photos[0].file ?? ''
    }
    return ''
  }

  public get guideTileProps(): GuideTileProps {
    let props: GuideTileProps = {
      imageSrc: this.mainImage,
      name: this.name,
      navigatePath: `/services/${this.id}`,
    }

    if (this.rating) {
      props.rating = this.rating
    }

    if (this.reviewCount) {
      props.reviewsCount = this.reviewCount
    }

    return props
  }

  public get placeTileProps(): PlaceTileProps {
    return {
      key: this.id,
      title: this.name,
      location: this.location?.locationSummary ?? '',
      text: this.description ?? '',
      imageSrc: this.mainImage,
      navigatePath: `/places/${this.id}`,
      rating: this.rating ?? undefined,
      reviewsCount: this.reviewCount,
      isFavorite: this.isFavorite,
    }
  }

  public get excursionTileProps(): ExcursionTileProps {
    return {
      name: this.name,
      locationName: this.location.locationSummary ?? undefined,
      rating: this.rating ?? undefined,
      minPrice: this.minExcursionPrice ?? undefined,
      imageSrc: this.mainImage,
      navigatePath: `/places/${this.id}`,
    }
  }

  public get bannerItemPropsList(): Array<BannerItemProps> {
    return this.photos.map(p => ({
      id: p.id,
      imageSrc: p.file ?? '',
    }))
  }

  public get ratingProps(): RatingProps | undefined {
    if (this.rating) {
      let props: RatingProps = {
        rating: this.rating,
      }
      if (this.reviewCount) {
        props.reviewsCount = this.reviewCount
      }
      return props
    } else {
      return undefined
    }
  }

  public get reviewTilePropsList(): Array<ReviewTileProps> {
    if (this.reviews.length === 0) return []
    const props: Array<ReviewTileProps> = this.reviews.map(r => ({
      name: r.createdBy.fullName,
      rating: r.starRate.id,
      text: r.text!,
      date: dayjs(r.createdDttm).format(dateTimeFormats.date),
    }))
    return props
  }

  public get placeIconProps(): PlaceIconProps {
    return {
      name: this.name,
      imageSrc: this.mainImage,
    }
  }

  constructor(data: Partial<Attraction>) {
    super({expand: true})

    this.update(data)
  }
}
