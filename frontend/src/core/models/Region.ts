import {BaseModel} from 'sjs-base-model'
import Creator from './Creator'

export type RegionExpand = Array<'locations' | 'cities'>

export default class Region extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any

  public region: string = ''

  constructor(data: Partial<Region>) {
    super({expand: true})
    this.update(data)
  }
}
