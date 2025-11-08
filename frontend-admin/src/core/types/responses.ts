import {
  Attraction,
  AttractionBrows,
  AttractionCall,
  AttractionContact,
  AttractionDiscount,
  AttractionPhoto,
  AttractionReview,
  AttractionSchedule,
  Banner,
  Chat,
  ChatMessage,
  City,
  Contact,
  Discount,
  ExcursionTime,
  Location,
  Region,
  Route,
  RoutePhoto,
  RouteReview,
  RouteStop,
  RouteTag,
  User,
  UserFavouriteAttraction,
} from '@app/core/models';
import Excursion from '../models/Excursion';
import ExcursionBooking from '../models/ExcursionBooking';
import ExcursionDate from '../models/ExcursionDate';

export interface ListResponse<T> {
  count: number;
  next?: string;
  pageCount?: number;
  previous?: string;
  results: T[];
}

export interface UserSignInResponse {
  access: string;
  refresh: string;
}

export interface UserSignUpResponse {
  email: User['email'];
  password: string;
  firstName: User['firstName'];
  lastName: User['lastName'];
  phone: User['phone'];
}

export interface UserCRUResponse {
  id: User['id'];
  firstName: User['firstName'];
  middleName: User['middleName'];
  lastName: User['lastName'];
  birthDate: User['birthDate'];
  gender: User['gender'];
  email: User['email'];
  phone: User['phone'];
  lastLocation: User['lastLocation'];
  isStaff: User['isStaff'];
  isActive: User['isActive'];
  file: User['file'];
  fileBase64: User['fileBase64'];
}

export interface LocationCRUResponse {
  id: Location['id'];
  createdDttm: Location['createdDttm'];
  createdBy: Location['createdBy'];
  point: Location['point'];
  region: Location['region'];
  regionId: Location['regionId'];
  city: Location['city'];
  cityId: Location['cityId'];
}

export interface BannersCRUResponse {
  id: Banner['id'];
  createdDttm: Banner['createdDttm'];
  createdBy: Banner['createdBy'];
  title: Banner['title'];
  subtitle: Banner['subtitle'];
  file: Banner['file'];
  fileBase64: Banner['fileBase64'];
  order: Banner['order'];
  isActive: Banner['isActive'];
  attraction: Banner['attraction'];
  route: Banner['route'];
  attractionId: Banner['attractionId'];
  routeId: Banner['routeId'];
}

export interface AttractionCRUResponse {
  id: Attraction['id'];
  createdDttm: Attraction['createdDttm'];
  createdBy: Attraction['createdBy'];
  reviewCount: Attraction['reviewCount'];
  name: Attraction['name'];
  likes: Attraction['likes'];
  views: Attraction['views'];
  calls: Attraction['calls'];
  containedRoutes: Attraction['containedRoutes'];
  isRecommended: Attraction['isRecommended'];
  isPromoting: Attraction['isPromoting'];
  isUserAdded: Attraction['isUserAdded'];
  status: Attraction['status'];
  isViewed: Attraction['isViewed'];
  distance: Attraction['distance'];
  rating: Attraction['rating'];
  description: Attraction['description'];
  howToGet: Attraction['howToGet'];
  mainDetails: Attraction['mainDetails'];
  audioGuid: Attraction['audioGuid'];
  averageCheck: Attraction['averageCheck'];
  ticketPriceFrom: Attraction['ticketPriceFrom'];
  cuisineKind: Attraction['cuisineKind'];
  minPrice: Attraction['minPrice'];
  roomNumber: Attraction['roomNumber'];
  checkinTime: Attraction['checkinTime'];
  checkoutTime: Attraction['checkoutTime'];
  publishedDttm: Attraction['publishedDttm'];
  location: Attraction['location'];
  locationId: Attraction['locationId'];
  categories: Attraction['categories'];
  photos: Attraction['photos'];
  schedules: Attraction['schedules'];
  routes: Attraction['routes'];
  usersFavourite: Attraction['usersFavourite'];
  promotions: Attraction['promotions'];
  userCalls: Attraction['userCalls'];
  userViews: Attraction['userViews'];
  contacts: Attraction['contacts'];
  discounts: Attraction['discounts'];
  reviews: Attraction['reviews'];
}

export interface UserFavAttractionCRUResponse {
  id: UserFavouriteAttraction['id'];
  createdDttm: UserFavouriteAttraction['createdDttm'];
  createdBy: UserFavouriteAttraction['createdBy'];
  user: UserFavouriteAttraction['user'];
  userId: UserFavouriteAttraction['userId'];
  attraction: UserFavouriteAttraction['attraction'];
  attractionId: UserFavouriteAttraction['attractionId'];
}

export interface UserCalledAttractionCRUResponse {
  id: AttractionCall['id'];
  createdDttm: AttractionCall['createdDttm'];
  createdBy: AttractionCall['createdBy'];
  count: AttractionCall['count'];
  user: AttractionCall['user'];
  userId: AttractionCall['userId'];
  attraction: AttractionCall['attraction'];
  attractionId: AttractionCall['attractionId'];
}

export interface UserViewedAttractionCRUResponse {
  id: AttractionBrows['id'];
  createdDttm: AttractionBrows['createdDttm'];
  createdBy: AttractionBrows['createdBy'];
  user: AttractionBrows['user'];
  userId: AttractionBrows['userId'];
  attraction: AttractionBrows['attraction'];
  attractionId: AttractionBrows['attractionId'];
}

export interface AttractionReviewCRUResponse {
  id: AttractionReview['id'];
  createdDttm: AttractionReview['createdDttm'];
  createdBy: AttractionReview['createdBy'];
  text: AttractionReview['text'];
  starRate: AttractionReview['starRate'];
  attraction: AttractionReview['attraction'];
  attractionId: AttractionReview['attractionId'];
  photos: AttractionReview['photos'];
}

export interface AttractionPhotoCRUResponse {
  id: AttractionPhoto['id'];
  createdDttm: AttractionPhoto['createdDttm'];
  createdBy: AttractionPhoto['createdBy'];
  order: AttractionPhoto['order'];
  file: AttractionPhoto['file'];
  date: AttractionPhoto['date'];
  comment: AttractionPhoto['comment'];
  attraction: Attraction;
  attractionId: Attraction['id'];
}

export interface AttractionScheduleCRUResponse {
  id: AttractionSchedule['id'];
  createdDttm: AttractionSchedule['createdDttm'];
  createdBy: AttractionSchedule['createdBy'];
  fromTime: AttractionSchedule['fromTime'];
  tillTime: AttractionSchedule['tillTime'];
  weekDay: AttractionSchedule['weekDay'];
  isFilled: AttractionSchedule['isFilled'];
  is24Hour: AttractionSchedule['is24Hour'];
  attraction: Attraction;
  attractionId: Attraction['id'];
}

export interface AttractionContactCRUResponse {
  id: AttractionContact['id'];
  createdDttm: AttractionContact['createdDttm'];
  createdBy: AttractionContact['createdBy'];
  attraction: Attraction;
  attractionId: Attraction['id'];
  contact: Contact;
  contactId: Contact['id'];
}

export interface RouteCRUResponse {
  id: Route['id'];
  createdDttm: Route['createdDttm'];
  createdBy: Route['createdBy'];
  reviewCount: Route['reviewCount'];
  viewCount: Route['viewCount'];
  likeCount: Route['likeCount'];
  rating: Route['rating'];
  length: Route['length'];
  name: Route['name'];
  description: Route['description'];
  mainDetails: Route['mainDetails'];
  difficulty: Route['difficulty'];
  totalDistance: Route['totalDistance'];
  totalDuration: Route['totalDuration'];
  status: Route['status'];
  publishedDttm: Route['publishedDttm'];
  kind: Route['kind'];
  kindId: Route['kindId'];
  stops: Route['stops'];
  tags: Route['tags'];
  reviews: Route['reviews'];
  photos: Route['photos'];
}

export interface RouteReviewCRUResponse {
  id: RouteReview['id'];
  createdDttm: RouteReview['createdDttm'];
  createdBy: RouteReview['createdBy'];
  text: RouteReview['text'];
  starRate: RouteReview['starRate'];
  route: RouteReview['route'];
  routeId: RouteReview['routeId'];
  photos: RouteReview['photos'];
}

export interface DiscountCRUResponse {
  id: Discount['id'];
  createdDttm: Discount['createdDttm'];
  createdBy: Discount['createdBy'];
  isPercent: Discount['isPercent'];
  percentValue: Discount['percentValue'];
  currencyValue: Discount['currencyValue'];
}

export interface AttractionDiscountCRUResponse {
  id: AttractionDiscount['id'];
  createdDttm: AttractionDiscount['createdDttm'];
  createdBy: AttractionDiscount['createdBy'];
  isByKatadze: AttractionDiscount['isByKatadze'];
  promocode: AttractionDiscount['promocode'];
  comment: AttractionDiscount['comment'];
  attraction: AttractionDiscount['attraction'];
  attractionId: AttractionDiscount['attractionId'];
  discount: AttractionDiscount['discount'];
  discountId: AttractionDiscount['discountId'];
}

export interface RoutePhotoCRUResponse {
  id: RoutePhoto['id'];
  createdDttm: RoutePhoto['createdDttm'];
  createdBy: RoutePhoto['createdBy'];
  file: RoutePhoto['file'];
  fileBase64: RoutePhoto['fileBase64'];
  date: RoutePhoto['date'];
  comment: RoutePhoto['comment'];
  order: RoutePhoto['order'];
  route: RoutePhoto['route'];
  routeId: RoutePhoto['routeId'];
}

export interface RouteTagCRUResponse {
  id: RouteTag['id'];
  createdDttm: RouteTag['createdDttm'];
  createdBy: RouteTag['createdBy'];
  route: RouteTag['route'];
  routeId: RouteTag['routeId'];
  tag: RouteTag['tag'];
  tagId: RouteTag['tagId'];
}

export interface RouteStopCRUResponse {
  id: RouteStop['id'];
  createdDttm: RouteStop['createdDttm'];
  createdBy: RouteStop['createdBy'];
  distanceToNext: RouteStop['distanceToNext'];
  order: RouteStop['order'];
  attraction: RouteStop['attraction'];
  attractionId: RouteStop['attractionId'];
  route: RouteStop['route'];
  routeId: RouteStop['routeId'];
}

export interface RegionCRUResponse {
  id: Region['id'];
  createdDttm: Region['createdDttm'];
  createdBy: Region['createdBy'];
  region: Region['region'];
}

export interface CityCRUResponse {
  id: City['id'];
  createdDttm: City['createdDttm'];
  createdBy: City['createdBy'];
  city: City['city'];
}

export interface GeocodeLatlngToAddressResponse {
  text: string;
  precision: string;
  kind: string;
  Address: {
    countryCode: string;
    formatted: string;
    Components: {
      kind: string;
      name: string;
    }[];
  };
}

export interface GeocodeAddressToLatlngResponse {
  coordinates: [number, number];
}

export interface ExcursionCRUResponse {
  id: Excursion['id'];
  createdDttm: Excursion['createdDttm'];
  createdBy: Excursion['createdBy'];
  isActive: Excursion['isActive'];
  attraction: Excursion['attraction'];
  attractionId: Excursion['attractionId'];
  route: Excursion['route'];
  routeId: Excursion['routeId'];
  scheduleDates: Excursion['scheduleDates'];
}

export interface ExcursionDateCRUResponse {
  id: ExcursionDate['id'];
  createdDttm: ExcursionDate['createdDttm'];
  createdBy: ExcursionDate['createdBy'];
  date: ExcursionDate['date'];
  excursion: ExcursionDate['excursion'];
  excursionId: ExcursionDate['excursionId'];
  minPrice: ExcursionDate['minPrice'];
  times: ExcursionDate['times'];
}

export interface ExcursionBookingCRUResponse {
  id: ExcursionBooking['id'];
  createdDttm: ExcursionBooking['createdDttm'];
  createdBy: ExcursionBooking['createdBy'];
  date: ExcursionBooking['date'];
  time: ExcursionBooking['time'];
  price: ExcursionBooking['price'];
  visitors: ExcursionBooking['visitors'];
  totalPrice: ExcursionBooking['totalPrice'];
  comment: ExcursionBooking['comment'];
  excursionTime: ExcursionBooking['excursionTime'];
  excursionTimeId: ExcursionBooking['excursionTimeId'];
}

export interface ExcursionTimeCRUResponse {
  id: ExcursionTime['id'];
  createdDttm: ExcursionTime['createdDttm'];
  createdBy: ExcursionTime['createdBy'];
  availablePlaces: ExcursionTime['availablePlaces'];
  time: ExcursionTime['time'];
  price: ExcursionTime['price'];
  excursionDate: ExcursionTime['excursionDate'];
  excursionDateId: ExcursionTime['excursionDateId'];
}

export interface ChatCRUResponse {
  id: Chat['id'];
  createdDttm: Chat['createdDttm'];
  createdBy: Chat['createdBy'];

  creatorUnreadMessageCount: Chat['creatorUnreadMessageCount'];
  adminUnreadMessageCount: Chat['adminUnreadMessageCount'];

  messages: Chat['messages'];
}

export interface ChatMessageCRUResponse {
  id: ChatMessage['id'];
  createdDttm: ChatMessage['createdDttm'];
  createdBy: ChatMessage['createdBy'];

  message: string | null;
  file: string | null;
  fileBase64: string | null;
  fileName: string | null;
  isRead: boolean;

  chatId: Chat['id'];
  chat: Chat;
}
