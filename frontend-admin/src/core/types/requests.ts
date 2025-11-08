import AttractionReview, {
  AttractionReviewExpand,
} from '@app/core/models/AttractionReview';
import Attraction, { AttractionExpand } from '@app/core/models/Attraction';
import AttractionBrows, {
  AttractionBrowsExpand,
} from '@app/core/models/AttractionBrows';
import AttractionCall, {
  AttractionCallExpand,
} from '@app/core/models/AttractionCall';
import Location, { LocationExpand } from '@app/core/models/Location';
import User, { UserExpand } from '@app/core/models/User';
import UserFavouriteAttraction, {
  UserFavAttractionExpand,
} from '@app/core/models/UserFavouriteAttraction';
import Route, { RouteExpand } from '@app/core/models/Route';
import RouteReview, { RouteReviewExpand } from '@app/core/models/RouteReview';
import AttractionContact, {
  AttractionContactExpand,
} from '@app/core/models/AttractionContact';
import Contact from '@app/core/models/Contact';
import Discount, { DiscountExpand } from '@app/core/models/Discount';
import AttractionDiscount, {
  AttractionDiscountExpand,
} from '@app/core/models/AttractionDiscount';
import AttractionSchedule, {
  AttractionScheduleExpand,
} from '@app/core/models/AttractionSchedule';
import AttractionPhoto, {
  AttractionPhotoExpand,
} from '@app/core/models/AttractionPhoto';
import RoutePhoto, { RoutePhotoExpand } from '@app/core/models/RoutePhoto';
import RouteTag, { RouteTagExpand } from '@app/core/models/RouteTag';
import RouteStop, { RouteStopExpand } from '@app/core/models/RouteStop';
import {
  Banner,
  Chat,
  City,
  Group,
  GroupKind,
  Region,
  Subgroup,
} from '@app/core/models';
import Excursion, { ExcursionExpand } from '../models/Excursion';
import ExcursionDate, { ExcursionDateExpand } from '../models/ExcursionDate';
import ExcursionBooking, {
  ExcursionBookingExpand,
} from '../models/ExcursionBooking';
import { BannerExpand } from '../models/Banner';
import ExcursionTime, { ExcursionTimeExpand } from '../models/ExcursionTime';

import ChatMessage, { ChatMessageExpand } from '../models/ChatMessage';
import { ChatExpand } from '../models/Chat';
import { GroupExpand } from '../models/Group';
import ContactKind from '../models/ContactKind';
import RouteProperties from '../models/RouteProperties';
import Post from '../models/Post';
import PostSection from '../models/PostSection';
import Feedback from '../models/Feedback';

export type NumberString<T> = T extends number ? string | number : T;

export interface ListRequest<T, S = never> {
  page?: number;
  size?: number;
  search?: string;
  ordering?: string;
  expand?: T;
  filters?: S;
}

export interface UserSignInRequest {
  email: string;
  password: string;
}

export interface TokenRefreshRequest {
  refresh: string;
}

export interface UserSignUpRequest {
  email: User['email'];
  password: string;
  firstName: User['firstName'];
  lastName: User['lastName'];
  phone?: User['phone'];
}

export interface UserReadRequest {
  id: User['id'];
  expand?: UserExpand;
}

export interface UserUpdateRequest {
  id: User['id'];
  first_name: User['firstName'];
  last_name: User['lastName'];
  email: User['email'];
  middle_name?: User['middleName'];
  birth_date?: User['birthDate'];
  gender?: User['gender']['id'];
  phone?: User['phone'];
  last_location?: User['lastLocation'];
  is_phone_verified?: User['isPhoneVerified'];
  is_staff?: User['isStaff'];
  file_base_64?: User['fileBase64'];
}

export type UserCreateRequest = Omit<UserUpdateRequest, 'id'>;

export type UserDeleteRequest = Omit<UserReadRequest, 'expand'>;

export interface LocationReadRequest {
  id: Location['id'];
  expand?: LocationExpand;
}

export interface LocationUpdateRequest {
  id: Location['id'];
  lat: NumberString<Location['lat']>;
  lon: NumberString<Location['lon']>;
  address: Location['locationSummary'];
  city: NumberString<Location['cityId']>;
  formatted?: Location['formatted'];
}

export type LocationCreateRequest = Omit<LocationUpdateRequest, 'id'>;

export type LocationDeleteRequest = Omit<LocationReadRequest, 'expand'>;

export interface AttractionReadRequest {
  id: Attraction['id'];
  expand?: AttractionExpand;
}

export interface AttractionUpdateRequest {
  id: Attraction['id'];
  name: Attraction['name'];
  location: Attraction['locationId'];
  description?: Attraction['description'];
  how_to_get?: Attraction['howToGet'];
  main_details?: Attraction['mainDetails'];
  audio_guid?: Attraction['audioGuid'];
  is_recommended?: Attraction['isRecommended'];
  status?: Attraction['status']['id'];
  is_user_added?: Attraction['isUserAdded'];
  ticket_price_from?: Attraction['ticketPriceFrom'];
  average_check?: Attraction['averageCheck'];
  cuisine_kind?: Attraction['cuisineKind'];
  min_price?: Attraction['minPrice'];
  room_number?: Attraction['roomNumber'];
  checkin_time?: Attraction['checkinTime'];
  checkout_time?: Attraction['checkoutTime'];
  published_dttm?: Attraction['publishedDttm'];
  groups: Array<NumberString<Attraction['groups'][number]['id']>>;
  subgroups?: Array<NumberString<Attraction['subgroups'][number]['id']>>;
}

export type AttractionCreateRequest = Omit<AttractionUpdateRequest, 'id'>;

export type AttractionDeleteRequest = Omit<AttractionReadRequest, 'expand'>;

export interface AttractionContactReadRequest {
  id: AttractionContact['id'];
  expand?: AttractionContactExpand;
}

export interface AttractionContactUpdateRequest {
  id: AttractionContact['id'];
  contact: AttractionContact['contact']['id'];
  attraction: Attraction['id'];
}

export type AttractionContactCreateRequest = Omit<
  AttractionContactUpdateRequest,
  'id'
>;

export type AttractionContactDeleteRequest = Omit<
  AttractionContactReadRequest,
  'expand'
>;

export interface BannerReadRequest {
  id: Banner['id'];
  expand?: BannerExpand;
}

export interface BannerUpdateRequest {
  id: Banner['id'];
  title: Banner['title'];
  subtitle: Banner['subtitle'];
  file?: Banner['file'];
  fileBase64?: Banner['fileBase64'];
  order?: Banner['order'];
  isActive?: Banner['isActive'];
  attraction?: Banner['attractionId'] | null;
  route?: Banner['routeId'] | null;
}

export type BannerCreateRequest = Omit<BannerUpdateRequest, 'id'>;

export type BannerDeleteRequest = BannerReadRequest;

export interface ContactReadRequest {
  id: AttractionContact['id'];
}

export interface ContactUpdateRequest {
  id: Contact['id'];
  value: Contact['value'];
  kind: ContactKind['id'];
}

export type ContactCreateRequest = Omit<ContactUpdateRequest, 'id'>;

export type ContactDeleteRequest = Omit<ContactReadRequest, 'expand'>;

export interface AttractionPhotoReadRequest {
  id: AttractionPhoto['id'];
  expand?: AttractionPhotoExpand;
}

export interface AttractionPhotoUpdateRequest {
  id: AttractionPhoto['id'];
  file?: AttractionPhoto['file'];
  file_base64?: AttractionPhoto['fileBase64'];
  attraction: Attraction['id'];
  date?: AttractionPhoto['date'];
  comment?: AttractionPhoto['comment'];
  order?: AttractionPhoto['order'];
}

export type AttractionPhotoCreateRequest = Omit<
  AttractionPhotoUpdateRequest,
  'id'
>;

export type AttractionPhotoDeleteRequest = Omit<
  AttractionPhotoReadRequest,
  'expand'
>;

export interface AttractionScheduleReadRequest {
  id: AttractionSchedule['id'];
  expand?: AttractionScheduleExpand;
}

export interface AttractionScheduleUpdateRequest {
  id: AttractionSchedule['id'];
  attraction: AttractionSchedule['attractionId'];
  week_day: number;
  from_time?: AttractionSchedule['fromTime'];
  till_time?: AttractionSchedule['tillTime'];
  is_filled?: AttractionSchedule['isFilled'];
  is_24_hour?: AttractionSchedule['is24Hour'];
}

export type AttractionScheduleCreateRequest = Omit<
  AttractionScheduleUpdateRequest,
  'id'
>;

export type AttractionScheduleDeleteRequest = Omit<
  AttractionScheduleReadRequest,
  'expand'
>;

export interface UserFavAttractionReadRequest {
  id: UserFavouriteAttraction['id'];
  expand?: UserFavAttractionExpand;
}

export interface UserFavAttractionUpdateRequest {
  id: UserFavouriteAttraction['id'];
  user: UserFavouriteAttraction['userId'];
  attraction: UserFavouriteAttraction['attractionId'];
}

export type UserFavAttractionCreateRequest = Omit<
  UserFavAttractionUpdateRequest,
  'id'
>;

export type UserFavAttractionDeleteRequest = Omit<
  UserFavAttractionReadRequest,
  'expand'
>;

export interface UserCalledAttractionReadRequest {
  id: AttractionCall['id'];
  expand?: AttractionCallExpand;
}

export interface UserCalledAttractionUpdateRequest {
  id: AttractionCall['id'];
  user: AttractionCall['userId'];
  attraction: AttractionCall['attractionId'];
}

export type UserCalledAttractionCreateRequest = Omit<
  UserCalledAttractionUpdateRequest,
  'id'
>;

export type UserCalledAttractionDeleteRequest = Omit<
  UserCalledAttractionReadRequest,
  'expand'
>;

export interface UserViewedAttractionReadRequest {
  id: AttractionBrows['id'];
  expand?: AttractionBrowsExpand;
}

export interface UserViewedAttractionUpdateRequest {
  id: AttractionBrows['id'];
  user: AttractionBrows['userId'];
  attraction: AttractionBrows['attractionId'];
}

export type UserViewedAttractionCreateRequest = Omit<
  UserViewedAttractionUpdateRequest,
  'id'
>;

export type UserViewedAttractionDeleteRequest = Omit<
  UserViewedAttractionReadRequest,
  'expand'
>;

export interface AttractionReviewReadRequest {
  id: AttractionReview['id'];
  expand?: AttractionReviewExpand;
}

export interface AttractionReviewUpdateRequest {
  id: AttractionReview['id'];
  star_rate: AttractionReview['starRate']['id'];
  attraction: AttractionReview['attractionId'];
  text?: AttractionReview['text'];
}

export type AttractionReviewCreateRequest = Omit<
  AttractionReviewUpdateRequest,
  'id'
>;

export type AttractionReviewDeleteRequest = Omit<
  AttractionReviewReadRequest,
  'expand'
>;

export interface RouteReadRequest {
  id: Route['id'];
  expand?: RouteExpand;
}

export interface RouteUpdateRequest {
  id: Route['id'];
  name: Route['name'];
  description: Route['description'];
  main_details?: Route['mainDetails'];
  difficulty?: Route['difficulty']['id'];
  total_distance?: Route['totalDistance'];
  total_duration?: Route['totalDuration'];
  status?: Route['status']['id'];
  published_dttm?: Route['publishedDttm'];
  kind?: Route['kindId'];
  properties?: {
    season?: RouteProperties['season'];
    riseDegree?: RouteProperties['riseDegree'];
    isOvernight?: RouteProperties['isOvernight'];
    isFamily?: RouteProperties['isFamily'];
    isOnHorseback?: RouteProperties['isOnHorseback'];
    isOnFoot?: RouteProperties['isOnFoot'];
    isOnQuadBike?: RouteProperties['isOnQuadBike'];
    isOnCar?: RouteProperties['isOnCar'];
    isSwimming?: RouteProperties['isSwimming'];
  } | null;
  customProperties?: Route['customProperties'];
}

export type RouteCreateRequest = Omit<RouteUpdateRequest, 'id'>;

export type RouteDeleteRequest = Omit<RouteReadRequest, 'expand'>;

export interface RouteReviewReadRequest {
  id: RouteReview['id'];
  expand?: RouteReviewExpand;
}

export interface RouteReviewUpdateRequest {
  id: RouteReview['id'];
  star_rate: RouteReview['starRate']['id'];
  route: RouteReview['routeId'];
  text?: RouteReview['text'];
}

export type RouteReviewCreateRequest = Omit<RouteReviewUpdateRequest, 'id'>;

export type RouteReviewDeleteRequest = Omit<RouteReviewReadRequest, 'expand'>;

export interface DiscountReadRequest {
  id: Discount['id'];
  expand?: DiscountExpand;
}

export interface DiscountUpdateRequest {
  id: Discount['id'];
  is_percent?: Discount['isPercent'];
  percent_value?: Discount['percentValue'];
  currency_value?: Discount['currencyValue'];
}

export type DiscountCreateRequest = Omit<DiscountUpdateRequest, 'id'>;

export type DiscountDeleteRequest = Omit<DiscountReadRequest, 'expand'>;

export interface AttractionDiscountReadRequest {
  id: AttractionDiscount['id'];
  expand?: AttractionDiscountExpand;
}

export interface AttractionDiscountUpdateRequest {
  id: AttractionDiscount['id'];
  attraction: AttractionDiscount['attractionId'];
  discount: AttractionDiscount['discountId'];
  promocode?: AttractionDiscount['promocode'];
  comment?: AttractionDiscount['comment'];
}

export type AttractionDiscountCreateRequest = Omit<
  AttractionDiscountUpdateRequest,
  'id'
>;

export type AttractionDiscountDeleteRequest = Omit<
  AttractionDiscountReadRequest,
  'expand'
>;

export interface RoutePhotoReadRequest {
  id: RoutePhoto['id'];
  expand?: RoutePhotoExpand;
}

export interface RoutePhotoUpdateRequest {
  id: RoutePhoto['id'];
  route: RoutePhoto['routeId'];
  file?: RoutePhoto['file'];
  file_base64?: RoutePhoto['fileBase64'];
  date?: RoutePhoto['date'];
  comment?: RoutePhoto['comment'];
  order?: RoutePhoto['order'];
}

export type RoutePhotoCreateRequest = Omit<RoutePhotoUpdateRequest, 'id'>;

export type RoutePhotoDeleteRequest = Omit<RoutePhotoReadRequest, 'expand'>;

export interface RouteTagReadRequest {
  id: RouteTag['id'];
  expand?: RouteTagExpand;
}

export interface RouteTagUpdateRequest {
  id: RouteTag['id'];
  tag: RouteTag['tagId'];
  route: RouteTag['routeId'];
}

export type RouteTagCreateRequest = Omit<RouteTagUpdateRequest, 'id'>;

export type RouteTagDeleteRequest = Omit<RouteTagReadRequest, 'expand'>;

export interface RouteStopReadRequest {
  id: RouteStop['id'];
  expand?: RouteStopExpand;
}

export interface RouteStopUpdateRequest {
  id: RouteStop['id'];
  order: RouteStop['order'];
  attraction: RouteStop['attractionId'];
  route: RouteStop['routeId'];
}

export type RouteStopCreateRequest = Omit<RouteStopUpdateRequest, 'id'>;

export type RouteStopDeleteRequest = Omit<RouteStopReadRequest, 'expand'>;

export interface RegionCreateRequest {
  region: Region['region'];
}

export type RegionDeleteRequest = {
  id: Region['id'];
};

export type RegionUpdateRequest = {
  id: Region['id'];
  region: Region['region'];
};

export interface CityCreateRequest {
  city: City['city'];
  region: NumberString<Region['id']>;
}

export interface GeocodeLatlngToAddressRequest {
  lon: number;
  lat: number;
}

export interface GeocodeAddressToLatlngRequest {
  address: string;
}

export interface ExcursionReadRequest {
  id: Excursion['id'];
  expand?: ExcursionExpand;
}

export type ExcursionDeleteRequest = Omit<ExcursionReadRequest, 'expand'>;

type ExcursionEntitytOptions =
  | {
      attraction: Excursion['attractionId'];
    }
  | {
      route: Excursion['routeId'];
    };

export type ExcursionCreateRequest = {
  isActive: Excursion['isActive'];
} & ExcursionEntitytOptions;

export type ExcursionUpdateRequest = ExcursionCreateRequest &
  ExcursionDeleteRequest;

export interface ExcursionDateReadRequest {
  id: ExcursionDate['id'];
  expand?: ExcursionDateExpand;
}

export interface ExcursionDateCreateRequest {
  date: ExcursionDate['date'];
  excursion: ExcursionDate['excursionId'];
}

export type ExcursionDateDeleteRequest = Omit<
  ExcursionDateReadRequest,
  'expand'
>;

export type ExcursionDateUpdateRequest = ExcursionDateDeleteRequest &
  ExcursionDateCreateRequest;

export interface ExcursionBookingCreateRequest {
  visitors: ExcursionBooking['visitors'];
  comment: ExcursionBooking['comment'];
  excursion_time: ExcursionBooking['excursionTime'];
}

export interface ExcursionBookingReadRequest {
  id: ExcursionBooking['id'];
  expand?: ExcursionBookingExpand;
}

export interface ExcursionBookingUpdateRequest {
  id: ExcursionBooking['id'];
  visitors: ExcursionBooking['visitors'];
  comment: ExcursionBooking['comment'];
  excursion_time: ExcursionBooking['excursionTimeId'];
}

export type ExcursionBookingDeleteRequest = Omit<
  ExcursionBookingReadRequest,
  'expand'
>;

export interface ExcursionTimeReadRequest {
  id: ExcursionTime['id'];
  expand?: ExcursionTimeExpand;
}

export interface ExcursionTimeCreateRequest {
  time: ExcursionTime['time'];
  price: ExcursionTime['price'];
  maxVisitors: ExcursionTime['maxVisitors'];
  excursionDate: ExcursionTime['excursionDateId'];
}

export type ExcursionTimeDeleteRequest = Omit<
  ExcursionTimeReadRequest,
  'expand'
>;

export type ExcursionTimeUpdateRequest = ExcursionTimeDeleteRequest &
  ExcursionTimeCreateRequest;

export interface ChatReadRequest {
  id: Chat['id'];
  expand?: ChatExpand;
}

export interface ChatUpdateRequest {
  id: Chat['id'];

  creatorUnreadMessageCount: Chat['creatorUnreadMessageCount'];
  adminUnreadMessageCount: Chat['adminUnreadMessageCount'];

  messages: Chat['messages'];
}

export type ChatMessageListRequest = ListRequest<ChatExpand> & {
  chat?: number;
};

export interface ChatMessageReadRequest {
  id: ChatMessage['id'];
  expand?: ChatMessageExpand;
}

export interface ChatMessageUpdateRequest {
  id: ChatMessage['id'];
  message?: ChatMessage['message'];
  file?: ChatMessage['file'];
  file_base64?: ChatMessage['fileBase64'];
  file_name?: ChatMessage['fileName'];
  is_read: ChatMessage['isRead'];
  chat: Chat['id'];
}

export type ChatMessageCreateRequest = Omit<ChatMessageUpdateRequest, 'id'>;

export type ChatMessageDeleteRequest = Omit<ChatMessageReadRequest, 'expand'>;

export type GroupReadRequest = {
  id: Group['id'];
  expand?: GroupExpand;
};

export type GroupCreateRequest = {
  name: Group['name'];
  icon?: Group['icon'];
  position?: NumberString<Group['position']>;
  kind: NumberString<Group['kindId']>;
};

export type GroupUpdateRequest = {
  id: Group['id'];
  name: Group['name'];
  icon?: Group['icon'];
  position?: NumberString<Group['position']>;
  kind: NumberString<Group['kindId']>;
  isUserCanContribute?: Group['isUserCanContribute'];
};

export type GroupDeleteRequest = GroupReadRequest;

export type GroupKindReadRequest = {
  id: GroupKind['id'];
};

export type SubgroupReadRequest = {
  id: Subgroup['id'];
};

export type SubgroupCreateRequest = {
  name: Subgroup['name'];
  icon?: Subgroup['icon'];
  position?: NumberString<Subgroup['position']>;
  group: NumberString<Subgroup['groupId']>;
};

export type SubgroupUpdateRequest = {
  id: Subgroup['id'];
  name: Subgroup['name'];
  icon?: Subgroup['icon'];
  position?: NumberString<Subgroup['position']>;
  group: NumberString<Subgroup['groupId']>;
};

export type SubgroupDeleteRequest = SubgroupReadRequest;

export interface CityDeleteRequest {
  id: City['id'];
}

export interface CityUpdateRequest {
  id: City['id'];
  city: City['city'];
  region: NumberString<Region['id']>;
}

export interface UserGalleryPhotoCreateRequest {
  file?: string;
  file_base64?: string;
  file_name?: string;
  description?: string;
  regionId: Region['id'];
}

export interface PostCreateRequest {
  sectionId: Post['sectionId'];
  coverData?: { fileBase64?: string; fileName?: string };
  title: Post['title'];
  text: Post['text'];
}

export interface PostUpdateRequest extends PostCreateRequest {
  id: Post['id'];
}

export interface PostSectionCreateRequest {
  name: PostSection['name'];
  slug: PostSection['slug'];
}

export interface PostSectionUpdateRequest extends PostSectionCreateRequest {
  id: PostSection['id'];
}

export interface FeedbackCreateRequest {
  name: Feedback['name'];
  phone?: Feedback['phone'];
  email?: Feedback['email'];
  subject?: Feedback['subject'];
  message?: Feedback['message'];
}

export interface FeedbackUpdateRequest extends FeedbackCreateRequest {
  id: Feedback['id'];
}
