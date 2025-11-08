import {BaseModel} from 'sjs-base-model'
import Creator from './Creator'

export class UserGalleryPhoto extends BaseModel {
  public id: number = 0
  public createdBy: Creator = Creator as any
  public createdDttm: string = ''
  public file: string | null = null
  public fileBase64: string | null = null
  public fileName: string | null = null
  public description: string | null = null
  public regionId: number | null = null
  public publishedAt: string | null = null

  constructor(data: Partial<UserGalleryPhoto>) {
    super({expand: true})
    this.update(data)
  }
}
