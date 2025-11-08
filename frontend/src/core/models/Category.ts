import {BaseModel} from 'sjs-base-model'
import Creator from './Creator'
import {Nullable} from 'types-helpers'

export type CategoryTypes =
  | 'mountains'
  | 'church'
  | 'rivers'
  | 'waterfall'
  | 'lakes'
  | 'other'

export const RU_CATEGORY_NAMES: Record<CategoryTypes, string> = {
  mountains: 'Горы',
  church: 'Храмы',
  rivers: 'Реки',
  waterfall: 'Водопады',
  lakes: 'Озера',
  other: 'Прочее',
}

export type CategoryExpand = Array<'attractions' | 'routes'>

export default class Category extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any
  public name: CategoryTypes = 'other'
  public isSeason: boolean = false

  public date: Nullable<string> = null
  public comment: Nullable<string> = null

  public file: Nullable<string> = null
  public fileName: Nullable<string> = null
  public fileBase64: Nullable<string> = null

  constructor(data: Partial<Category>) {
    super({expand: true})
    this.update(data)
  }
}
