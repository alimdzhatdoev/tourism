import {BaseModel} from 'sjs-base-model'
import ContactKind from './ContactKind'
import Creator from './Creator'

export type ContactExpand = Array<'kind'>

export default class Contact extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any

  public value: string = ''
  public logo: string | null = null

  public kind: ContactKind = ContactKind as any
  public kindId: ContactKind['id'] = 0

  constructor(data: Partial<Contact>) {
    super({expand: true})
    this.update(data)
  }
}
