import {BaseModel} from 'sjs-base-model'
import {Nullable} from 'types-helpers'

export type RouteSeason = 'winter' | 'spring' | 'summer' | 'autumn' | 'all'

export default class RouteProperties extends BaseModel {
  public season: Nullable<RouteSeason> = null
  public riseDegree: Nullable<number> = null
  public isOvernight: Nullable<boolean> = null
  public isFamily: Nullable<boolean> = null
  public isOnHorseback: Nullable<boolean> = null
  public isOnFoot: Nullable<boolean> = null
  public isOnQuadBike: Nullable<boolean> = null
  public isOnCar: Nullable<boolean> = null
  public isSwimming: Nullable<boolean> = null

  constructor(data: Partial<Location>) {
    super({expand: true})
    this.update(data)
  }
}
