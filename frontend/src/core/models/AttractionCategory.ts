import {BaseModel} from 'sjs-base-model'
import Creator from './Creator'
import Attraction from './Attraction'
import Category from './Category'

export default class AttractionCategory extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any

  public attraction: Attraction = Attraction as any
  public category: Category = Category as any
  public attractionId: Attraction['id'] = 0
  public categoryId: Category['id'] = 0

  constructor(data: Partial<AttractionCategory>) {
    super({expand: true})
    this.update(data)
  }
}
