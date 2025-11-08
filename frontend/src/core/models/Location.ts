import {BaseModel} from 'sjs-base-model'
import Creator from './Creator'
import Region from './Region'
import City from './City'
import {Nullable} from 'types-helpers'

export type Point = {
  lat: number
  lon: number
}

export type LocationExpand = Array<'region' | 'city'>

export default class Location extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any
  public point: Nullable<{coordinates: [number, number]}> = null
  public address: Nullable<string> = null
  public formatted: Nullable<string> = null

  public region: Region = Region as any
  public city: City = City as any

  public regionId: Region['id'] = 0
  public cityId: City['id'] = 0

  public get locationSummary() {
    if (!this.region.region || !this.city.city) return this.formatted

    return [this.region.region, this.city.city, this.address]
      .filter(Boolean)
      .join(', ')
  }

  public get placemarkGeometry(): [number, number] | undefined {
    if (!this.point) return undefined
    const [lon, lat] = this.point.coordinates
    return [lat, lon]
  }

  constructor(data: Partial<Location>) {
    super({expand: true})
    this.update(data)
  }
}
