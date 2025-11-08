declare module 'types-requests' {
  import {Expand} from 'types-helpers'
  import {
    User,
    ExcursionBooking,
    Payment,
    AttractionReview,
    RouteReview,
    Region,
    Feedback,
  } from '../models'

  export type ReadRequest<
    E = undefined,
    T extends {id: number} = {id: number},
  > = {
    id: T['id']
    expand?: Expand<E>
  }

  export interface ListRequest<E = undefined, F = never> {
    page?: number
    size?: number
    search?: string
    expand?: Expand<E>
    filters?: F
  }

  export interface AuthenticateResquest {
    email: User['email']
    phone?: User['phone']
  }

  export interface AuthorizeRequest {
    email: string
    password: string
  }

  export interface UsersMeRequest {
    email: string
    password: string
  }

  export interface ExcursionBookingCreateRequest {
    visitors: number
    comment: string
    excursion_time: number
    payment_kind: ExcursionBooking['paymentKind']
  }

  export interface PaymentCreateRequest {
    cryptogram: string
    amount: Payment['amount']
    name?: Payment['name']
    currency?: Payment['currency']
    transaction_id?: Payment['transactionId']
    description?: Payment['description']
    culture_name?: Payment['cultureName']
    account_id?: Payment['accountId']
    email?: Payment['email']
  }

  export interface PaymentCheckRequest {
    id: Payment['id']
    pa_res: Payment['PaReq']
    transaction_id: Payment['MD']
  }

  export interface AttractionReviewCreateRequest {
    star_rate: AttractionReview['starRate']['id']
    attraction: AttractionReview['attractionId']
    text?: AttractionReview['text']
  }

  export interface RouteReviewCreateRequest {
    star_rate: RouteReview['starRate']['id']
    route: RouteReview['attractionId']
    text?: RouteReview['text']
  }

  export interface UserGalleryPhotoCreateRequest {
    file?: string
    file_base64?: string
    file_name?: string
    description?: string
    regionId: Region['id']
  }

  export interface FeedbackCreateRequest {
    name: Feedback['name']
    phone?: Feedback['phone']
    email?: Feedback['email']
    subject?: Feedback['subject']
    message?: Feedback['message']
  }

  export interface FeedbackUpdateRequest extends FeedbackCreateRequest {
    id: Feedback['id']
  }

  export interface UserUpdateRequest {
    first_name?: string
    email: string
  }
}
