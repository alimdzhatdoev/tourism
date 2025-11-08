import {BaseModel} from 'sjs-base-model'
import Creator from './Creator'

export default class City extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any
  public city: string = ''

  constructor(data: Partial<City>) {
    super({expand: true})
    this.update(data)
  }
}
