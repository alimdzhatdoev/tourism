import {BaseModel} from 'sjs-base-model'
import ExcursionTime from './ExcursionTime'
import Creator from './Creator'
import {BookingTileProps} from '@/ui/components/_tiles'
import {Attraction} from '.'
import dayjs from 'dayjs'

export interface ExcursionBookingsFilters {
  ordering: 'created_dttm' | '-created_dttm'
  search: string
  page: number
  size: number
  created_by_id: Creator['id']
}

export type ExcursionBookingExpand = Array<
  | 'excursion_time'
  | 'excursion_time__excursion_date__excursion__attraction__photos'
>

export type PaymentKind = 'CASH' | 'CARD'

export const RU_PAYMENT_KINDS: Record<PaymentKind, string> = {
  CARD: 'Картой',
  CASH: 'Наличными',
}

export default class ExcursionBooking extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any
  public date: string = ''
  public time: string = ''
  public price: number = 0
  public visitors: number = 0
  public totalPrice: number = 0
  public comment: string | null = null
  public paymentKind: PaymentKind = 'CASH'
  public excursionTime: ExcursionTime | null = null
  public excursionTimeId: ExcursionTime['id'] | null = null

  public get bookingTileProps(): BookingTileProps {
    let props: BookingTileProps = {
      name: '',
      hint: dayjs(`${this.date} ${this.time}`).format('DD MMMM в HH:mm, dddd'),
    }

    if (this.excursionTime?.excursionDate.excursion.attraction) {
      const {attraction} = this.excursionTime.excursionDate.excursion
      props.name = attraction.name
      props.imageSrc = new Attraction(attraction).mainImage
      props.navigatePath = `/places/${attraction.id}`
    }

    return props
  }

  constructor(data: Partial<ExcursionBooking>) {
    super({expand: true})
    this.update(data)
  }
}
