import {BaseModel} from 'sjs-base-model'
import Creator from './Creator'

export default class Tag extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any
  public name: string = ''

  constructor(data: Partial<Tag>) {
    super({expand: true})
    this.update(data)
  }
}
