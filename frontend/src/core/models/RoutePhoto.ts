import {BaseModel} from 'sjs-base-model'
import Creator from './Creator'
import Route from './Route'

export type RoutePhotoExpand = ReadonlyArray<'route'>

export default class RoutePhoto extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any

  public file: string | null = null
  public fileBase64: string | null = null
  public date: string | null = null
  public comment: string | null = null
  public order: number | null = null

  public route: Route = Route as any
  public routeId: Route['id'] = 0

  constructor(data: Partial<RoutePhoto>) {
    super({expand: true})
    this.update(data)
  }
}
