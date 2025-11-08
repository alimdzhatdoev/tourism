import {BaseModel} from 'sjs-base-model'
import Creator from './Creator'
import Attraction from './Attraction'
import Promotion from './Promotion'
import Payment from './Payment'

export type AttractionPromotionExpand = Array<
  'attraction' | 'promotion' | 'payment'
>

export default class AttractionPromotion extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any

  public fromDttm: string = ''
  public tillDttm: string = ''
  public attraction: Attraction = Attraction as any
  public promotion: Promotion = Promotion as any
  public payment: Payment = Payment as any

  public attractionId: Attraction['id'] = 0
  public promotionId: Promotion['id'] = 0
  public paymentId: Payment['id'] = 0

  constructor(data: Partial<AttractionPromotion>) {
    super({expand: true})
    this.update(data)
  }
}
