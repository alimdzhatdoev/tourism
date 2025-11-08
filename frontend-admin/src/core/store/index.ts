import { configureStore } from '@reduxjs/toolkit';
import { API_REDUCERS_ENUM } from './reducers';
import users from './users';
import locations from './locations';
import attractions from './attractions';
import userFavAttractions from './user_favourites';
import userCalledAttractions from './user_called_attractions';
import userViewedAttractions from './user_viewed_attractions';
import attractionReviews from './attraction_reviews';
import routeReviews from './route_reviews';
import routes from './routes';
import user from './user/reducer';
import attractionsPhotos from './attractions_photos';
import attractionsContacts from './attractions_contacts';
import attractionsSchedules from './attractions_schedules';
import discounts from './discounts';
import attractionDiscounts from './attraction_discounts';
import routePhotos from './route_photos';
import routeTags from './route_tags';
import routeStops from './route_stops';
import cities from './cities';
import regions from './regions';
import categories from '@app/core/store/categories';
import bannersApi from '@app/core/store/banner';
import excursions from './excursions';
import excursionDates from './excursion_dates';
import excursionTimes from './excursion_times';
import excursionBookings from './excursion_bookings';
import chats from './chats';
import chatMessages from './chat_messages';
import groupsApi from './groups';
import groupKindsApi from './group_kinds';
import subgroupsApi from './subgroups';
import { contactKindsApi } from './contact_kinds';
import { contactsApi } from './contacts';
import { userGalleryPhotosApi } from './user_gallery_photos';
import postSectionsApi from './post_sections';
import postsApi from './posts';
import feedbacksApi from './feedbacks';

export const store = configureStore({
  reducer: {
    user,
    [feedbacksApi.reducerPath]: feedbacksApi.reducer,
    [subgroupsApi.reducerPath]: subgroupsApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [contactsApi.reducerPath]: contactsApi.reducer,
    [groupKindsApi.reducerPath]: groupKindsApi.reducer,
    [groupsApi.reducerPath]: groupsApi.reducer,
    [contactKindsApi.reducerPath]: contactKindsApi.reducer,
    [userGalleryPhotosApi.reducerPath]: userGalleryPhotosApi.reducer,
    [postSectionsApi.reducerPath]: postSectionsApi.reducer,
    [API_REDUCERS_ENUM.USERS]: users.reducer,
    [API_REDUCERS_ENUM.LOCATIONS]: locations.reducer,
    [API_REDUCERS_ENUM.ATTRACTIONS]: attractions.reducer,
    [API_REDUCERS_ENUM.USER_FAVOURITE_ATTRACTIONS]: userFavAttractions.reducer,
    [API_REDUCERS_ENUM.USER_CALLED_ATTRACTIONS]: userCalledAttractions.reducer,
    [API_REDUCERS_ENUM.USER_VIEWED_ATTRACTIONS]: userViewedAttractions.reducer,
    [API_REDUCERS_ENUM.ATTRACTIONS_REVIEWS]: attractionReviews.reducer,
    [API_REDUCERS_ENUM.ROUTES]: routes.reducer,
    [API_REDUCERS_ENUM.ROUTE_REVIEWS]: routeReviews.reducer,
    [API_REDUCERS_ENUM.ATTRACTION_PHOTOS]: attractionsPhotos.reducer,
    [API_REDUCERS_ENUM.ATTRACTION_CONTACTS]: attractionsContacts.reducer,
    [API_REDUCERS_ENUM.ATTRACTION_SCHEDULES]: attractionsSchedules.reducer,
    [API_REDUCERS_ENUM.DISCOUNTS]: discounts.reducer,
    [API_REDUCERS_ENUM.ATTRACTION_DISCOUNTS]: attractionDiscounts.reducer,
    [API_REDUCERS_ENUM.ROUTE_PHOTOS]: routePhotos.reducer,
    [API_REDUCERS_ENUM.ROUTE_TAGS]: routeTags.reducer,
    [API_REDUCERS_ENUM.ROUTE_STOPS]: routeStops.reducer,
    [API_REDUCERS_ENUM.CITIES]: cities.reducer,
    [API_REDUCERS_ENUM.REGIONS]: regions.reducer,
    [API_REDUCERS_ENUM.BANNERS]: bannersApi.reducer,
    [API_REDUCERS_ENUM.CATEGORIES]: categories.reducer,
    [API_REDUCERS_ENUM.EXCURSIONS]: excursions.reducer,
    [API_REDUCERS_ENUM.EXCURSION_DATES]: excursionDates.reducer,
    [API_REDUCERS_ENUM.EXCURSION_TIMES]: excursionTimes.reducer,
    [API_REDUCERS_ENUM.EXCURSION_BOOKINGS]: excursionBookings.reducer,
    [API_REDUCERS_ENUM.CHATS]: chats.reducer,
    [API_REDUCERS_ENUM.CHAT_MESSAGES]: chatMessages.reducer,
  },
  middleware: defaultMiddleware =>
    defaultMiddleware({ serializableCheck: false }).concat(
      feedbacksApi.middleware,
      postsApi.middleware,
      userGalleryPhotosApi.middleware,
      postSectionsApi.middleware,
      subgroupsApi.middleware,
      contactKindsApi.middleware,
      groupKindsApi.middleware,
      groupsApi.middleware,
      attractionsSchedules.middleware,
      users.middleware,
      contactsApi.middleware,
      locations.middleware,
      attractionsContacts.middleware,
      attractions.middleware,
      userFavAttractions.middleware,
      bannersApi.middleware,
      userCalledAttractions.middleware,
      userViewedAttractions.middleware,
      attractionReviews.middleware,
      routes.middleware,
      routeReviews.middleware,
      attractionsPhotos.middleware,
      discounts.middleware,
      attractionDiscounts.middleware,
      routePhotos.middleware,
      routeTags.middleware,
      routeStops.middleware,
      cities.middleware,
      regions.middleware,
      categories.middleware,
      excursions.middleware,
      excursionDates.middleware,
      excursionTimes.middleware,
      excursionBookings.middleware,
      chats.middleware,
      chatMessages.middleware,
    ),
});

export type AppState = ReturnType<typeof store.getState>;
