import {BaseModel} from 'sjs-base-model'
import Creator from './Creator'
import AttractionReview from './AttractionReview'

export type AttractionReviewPhotoExpand = Array<'review'>

export default class AttractionReviewPhoto extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any

  public file: string = ''
  public fileBase64: string | null = null
  public date: string | null = null
  public order: number | null = null
  public comment: string | null = null
  public review: AttractionReview = AttractionReview as any
  public reviewId: AttractionReview['id'] = 0

  constructor(data: Partial<AttractionReviewPhoto>) {
    super({expand: true})
    this.update(data)
  }
}
