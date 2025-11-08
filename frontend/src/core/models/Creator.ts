import {BaseModel} from 'sjs-base-model'
import {Nullable} from 'types-helpers'

export default class Creator extends BaseModel {
  public id: number = 0
  public isAdmin: boolean = false
  public firstName: string = ''
  public lastName: string = ''
  public file: Nullable<string> = null

  public get fullName(): string | undefined {
    if (!this.firstName && !this.lastName) return undefined
    return [this.firstName, this.lastName]
      .filter(Boolean)
      .map(n => n[0].toUpperCase() + n.slice(1).toLowerCase())
      .join(' ')
  }

  public get initials() {
    if (!this.firstName && !this.lastName) return undefined
    return [this.firstName, this.lastName]
      .filter(Boolean)
      .map(n => n[0].toUpperCase())
      .join(' ')
  }

  constructor(data: Partial<Creator>) {
    super({expand: true})
    this.update(data)
  }
}
