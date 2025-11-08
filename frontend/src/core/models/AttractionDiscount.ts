import {BaseModel} from 'sjs-base-model'
import Creator from './Creator'
import Attraction from './Attraction'
import Discount from './Discount'

export type AttractionDiscountExpand = Array<
  'discount' | 'discount__attractions' | 'attraction'
>

export type AttractionDiscountFilters = {
  ordering: 'created_dttm' | '-created_dttm'
}

export default class AttractionDiscount extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any
  public isByKatadze: boolean = false
  public promocode: string | null = null
  public comment: string | null = null

  public attraction: Attraction = Attraction as any
  public discount: Discount = Discount as any
  public attractionId: Attraction['id'] = 0
  public discountId: Discount['id'] = 0

  constructor(data: Partial<AttractionDiscount>) {
    super({expand: true})
    this.update(data)
  }
}
