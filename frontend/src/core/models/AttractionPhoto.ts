import {BaseModel} from 'sjs-base-model'
import Creator from './Creator'
import Attraction from './Attraction'
import {Nullable} from 'types-helpers'

export type AttractionPhotoExpand = Array<'attraction'>

export default class AttractionPhoto extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any

  public fileBase64: Nullable<string> = null
  public fileName: Nullable<string> = null
  public file: Nullable<string> = null
  public thumbnail: string = ''
  public date: Nullable<string> = null
  public comment: Nullable<string> = null
  public order: Nullable<number> = null

  public attraction: Attraction = Attraction as any
  public attractionId: Attraction['id'] = 0

  constructor(data: Partial<AttractionPhoto>) {
    super({expand: true})
    this.update(data)
  }
}
