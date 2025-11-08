import {BaseModel} from 'sjs-base-model'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import relativeTime from 'dayjs/plugin/relativeTime'
import Creator from './Creator'
import Route from './Route'
import RouteReviewPhoto from './RouteReviewPhoto'

dayjs.extend(relativeTime)
dayjs.locale('ru')

export type RouteReviewExpand = ReadonlyArray<
  'route' | 'photos' | 'route__tags' | 'route__tags__tag'
>

export type RouteReviewFilters = {
  route_id: Route['id']
}

export default class RouteReview extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any

  public starRate: {
    id: 1 | 2 | 3 | 4 | 5
    label: 'One' | 'Two' | 'Three' | 'Four' | 'Five'
  } = {id: 1, label: 'One'}
  public text: string | null = null

  public route: Route = Route as any
  public routeId: Route['id'] = 0

  public photos: RouteReviewPhoto[] = [RouteReviewPhoto as any]

  public get relatedTimeAgo() {
    return dayjs(this.createdDttm).locale('ru').fromNow()
  }

  public get isJustMark() {
    return !this.text && !this.photos.length
  }

  constructor(data: Partial<RouteReview>) {
    super({expand: true})
    this.update(data)
  }
}
