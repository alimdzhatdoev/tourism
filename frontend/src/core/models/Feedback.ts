import {BaseModel} from 'sjs-base-model'
import {Nullable} from 'types-helpers'

export default class Feedback extends BaseModel {
  public id: number = 0
  public createdAt: string = ''
  public seenAt: string = ''
  public name: string = ''
  public message: Nullable<string> = null
  public subject: Nullable<string> = null
  public email: Nullable<string> = null
  public phone: Nullable<string> = null

  constructor(data: Partial<Feedback>) {
    super({expand: true})
    this.update(data)
  }
}
