import {BaseModel} from 'sjs-base-model'
import Creator from './Creator'
import RouteKind from './RouteKind'
import RoutePhoto from './RoutePhoto'
import RouteReview from './RouteReview'
import RouteStop from './RouteStop'
import RouteTag from './RouteTag'
import Category from './Category'
import Excursion from './Excursion'
import UserFavouriteRoute from './UserFavouriteRoute'
import {
  ExcursionTileProps,
  ReviewTileProps,
  RoutePointTileProps,
  RouteTileProps,
} from '@/ui/components/_tiles'
import {BannerItemProps, RatingProps} from '@/ui/components'
import {PlacemarkItemProps} from '@/modules/mui-yandex-maps/types'
import {PlaceIconProps} from '@/ui/components/_map-icons'
import {dateTimeFormats} from '@/constants'
import dayjs from 'dayjs'
import {Nullable} from 'types-helpers'
import RouteProperties, {RouteSeason} from './RouteProperties'

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
  | 'excursions'
>

export type RouteFilters = {
  /**
   * @example RouteTag['name'][].join(',')
   */
  tags__tag__name__in: string
  stops__attraction__location__city__city: RouteStop['attraction']['location']['city']['city']
  categories__category__name: Category['name']
  /**
   * @example Category['name'][].join(',');
   */
  categories__category__name__in: string | null
  season: RouteProperties['season']
  is_liked: boolean
  is_overnight: 'True' | 'False' | 'None'
  is_family: 'True' | 'False' | 'None'
  is_on_horseback: 'True' | 'False' | 'None'
  is_on_foot: 'True' | 'False' | 'None'
  is_on_quad_bike: 'True' | 'False' | 'None'
  is_on_car: 'True' | 'False' | 'None'
  is_swimming: 'True' | 'False' | 'None'
  isFavorite: boolean
  min_difficulty: number
  max_difficulty: number
}

export type RouteStatusIds =
  | 'CREATION'
  | 'VERIFICATION'
  | 'SUSPENSION'
  | 'PUBLICATION'

export type RouteStatus = {
  id: RouteStatusIds
  label: string
}

export type RouteDifficulty = {
  id: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
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
    | 'Ten'
}

interface CustomProperties {
  toTakeWithYou: null | Array<{title: string; items: Array<string>}>
  listDescription: null | Array<{title: string; text: string}>
}

export const ROUTE_SEASONS: Record<RouteSeason, string> = {
  all: 'Все сезоны',
  autumn: 'Осень',
  spring: 'Весна',
  summer: 'Лето',
  winter: 'Зима',
}

export default class Route extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any
  public reviewCount: number = 0
  public viewCount: number = 0
  public likeCount: number = 0
  public length: number = 0
  public time: number = 0
  public name: string = ''
  public userLikes: UserFavouriteRoute[] = [UserFavouriteRoute as any]
  public description: string = ''
  public totalDistance: number | null = null
  public totalDuration: number | null = null
  public difficulty: RouteDifficulty = {id: 1, label: 'One'}
  public status: RouteStatus = {
    id: 'SUSPENSION',
    label: 'suspension',
  }
  public mainDetails: string | null = null
  public rating: number | null = null
  public publishedDttm: string | null = null

  public stops: RouteStop[] = [RouteStop as any]
  public tags: RouteTag[] = [RouteTag as any]
  public reviews: RouteReview[] = [RouteReview as any]
  public photos: RoutePhoto[] = [RoutePhoto as any]

  public kind: RouteKind = RouteKind as any
  public kindId: RouteKind['id'] = 0

  public minExcursionPrice: number | null = null
  public excursions: Excursion[] = [Excursion as any]

  public properties: Nullable<RouteProperties> = null

  public customProperties: Nullable<CustomProperties> = null

  public isLiked: boolean = false

  public get mainImage() {
    if (this.photos.length > 0) {
      return this.photos[0].file ?? ''
    }
    return ''
  }

  public get excursionTileProps(): ExcursionTileProps {
    return {
      name: this.name,
      rating: this.rating ?? undefined,
      // locationName: this.location.locationSummary ?? undefined,
      minPrice: this.minExcursionPrice ?? undefined,
      imageSrc: this.mainImage,
      navigatePath: `/routes/${this.id}`,
    }
  }

  public get bannerItemPropsList(): Array<BannerItemProps> {
    return this.photos.map(p => ({
      id: p.id,
      imageSrc: p.file ?? '',
    }))
  }

  public get routeTileProps(): RouteTileProps {
    return {
      name: this.name,
      title: this.name,
      text: this.description,
      imageSrc: this.mainImage,
      navigatePath: `/routes/${this.id}`,
      difficulty: this.difficulty,
      totalDistance: this.totalDistance,
      totalDuration: this.totalDuration,
      isFavorite: this.isLiked,
      properties: this.properties,
    }
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
    if (this.reviews.length > 0) {
      return this.reviews.map(r => ({
        name: r.createdBy.fullName,
        rating: r.starRate.id,
        text: r.text!,
        date: dayjs(r.createdDttm).format(dateTimeFormats.date),
      }))
    } else {
      return []
    }
  }

  public get routePointTilePropsList(): Array<RoutePointTileProps> {
    return this.stops.map((s, i) => ({
      index: i,
      name: s.attraction.name,
      imageSrc: s.attraction.mainImage,
      navigatePath: `/places/${s.attraction.id}`,
    }))
  }

  public placeMarkItemPropsList(
    onClick: (coordinates?: [number, number]) => () => void,
  ): Array<PlacemarkItemProps<PlaceIconProps>> {
    return this.stops.map(s => ({
      iconProps: {
        name: s.attraction.name,
        imageSrc: s.attraction.mainImage,
      },
      id: s.attraction.id,
      width: 400,
      height: 100,
      defaultGeometry: s.attraction.location.placemarkGeometry,
      onClick: onClick(s.attraction.location.placemarkGeometry),
    }))
  }

  constructor(data: Partial<Route>) {
    super({expand: true})
    this.update(data)
  }
}
