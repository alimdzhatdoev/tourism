import {BaseModel} from 'sjs-base-model'
import Creator from './Creator'
import User from './User'
import Attraction from './Attraction'

export type UserFavAttractionExpand = Array<
  | 'user'
  | 'attraction'
  | 'attraction__photos'
  | 'attraction__location'
  | 'attraction__location__region'
  | 'attraction__location__city'
  | 'attraction__categories__category'
  | 'attraction__users_favourite'
>

export default class UserFavouriteAttraction extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any

  public attraction: Attraction = Attraction as any
  public user: User = User as any

  public attractionId: Attraction['id'] = 0
  public userId: User['id'] = 0

  constructor(data: Partial<UserFavouriteAttraction>) {
    super({expand: true})
    this.update(data)
  }
}
