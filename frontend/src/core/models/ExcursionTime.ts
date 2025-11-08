import {BaseModel} from 'sjs-base-model'
import Creator from './Creator'
import ExcursionDate from './ExcursionDate'

export type ExcursionTimeExpand = 'excursionDate'[]

export default class ExcursionTime extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any
  public availablePlaces: string = ''
  public time: string = ''
  public price: number = 0
  public maxVisitors: number = 0
  public excursionDate: ExcursionDate = ExcursionDate as any
  public excursionDateId: ExcursionDate['id'] | null = null

  constructor(data: Partial<ExcursionTime>) {
    super({expand: true})
    this.update(data)
  }
}
