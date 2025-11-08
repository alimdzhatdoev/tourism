import {BaseModel} from 'sjs-base-model'
import Creator from './Creator'
import RouteReview from './RouteReview'

export type RouteReviewPhotoExpand = Array<'review'>

export default class RouteReviewPhoto extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any

  public file: string = ''
  public date: string | null = null
  public comment: string | null = null
  public review: RouteReview = RouteReview as any
  public reviewId: RouteReview['id'] = 0

  constructor(data: Partial<RouteReviewPhoto>) {
    super({expand: true})
    this.update(data)
  }
}
