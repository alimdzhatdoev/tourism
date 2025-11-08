declare module 'types-responses' {
  import {Nullable} from 'types-helpers'
  import {Tokens} from 'types-common'
  import {User, AttractionReview, RouteReview} from '../models'
  export interface ListResponse<T = unknown> {
    count: number
    next: Nullable<string>
    pageCount: number
    previous: Nullable<string>
    results: Array<T>
  }

  export type ErrorResponse = any

  export interface AuthenticateResponse {
    email: User['email']
    phone?: User['phone']
  }

  export type AuthorizeResponse = Tokens

  export interface PaymentCheckResponse {
    isSuccess: boolean
    message: string
  }

  export interface AttractionReviewCRUResponse {
    id: AttractionReview['id']
    createdDttm: AttractionReview['createdDttm']
    createdBy: AttractionReview['createdBy']
    text: AttractionReview['text']
    starRate: AttractionReview['starRate']
    attraction: AttractionReview['attraction']
    attractionId: AttractionReview['attractionId']
    photos: AttractionReview['photos']
  }

  export interface RouteReviewCRUResponse {
    id: RouteReview['id']
    createdDttm: RouteReview['createdDttm']
    createdBy: RouteReview['createdBy']
    text: RouteReview['text']
    starRate: RouteReview['starRate']
    route: RouteReview['attraction']
    routeId: RouteReview['attractionId']
    photos: RouteReview['photos']
  }
}
