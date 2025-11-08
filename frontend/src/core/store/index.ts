import {configureStore} from '@reduxjs/toolkit'
import {misc} from './misc'
import bannersApi from './banner'
import attractionsApi from './attractions'
import excursionsApi from './excursions'
import routesApi from './routes'
import authenticationApi from './auth'
import usersApi from './users'
import excursionBookingsApi from './excursion_bookings'
import paymentsApi from './payments'
import groupsApi from './groups'
import subgroupsApi from './subgroups'
import routesReviewApi from './route_reviews'
import attractionsReviewApi from './attraction_reviews'
import userGalleryPhotosApi from './user_gallery_photos'
import postsApi from './posts'
import postSectionsApi from './post_sections'
import regionsApi from './regions'
import feedbacksApi from './feedbacks'

const store = configureStore({
  reducer: {
    misc,
    [feedbacksApi.reducerPath]: feedbacksApi.reducer,
    [regionsApi.reducerPath]: regionsApi.reducer,
    [postSectionsApi.reducerPath]: postSectionsApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [attractionsReviewApi.reducerPath]: attractionsReviewApi.reducer,
    [routesReviewApi.reducerPath]: routesReviewApi.reducer,
    [subgroupsApi.reducerPath]: subgroupsApi.reducer,
    [groupsApi.reducerPath]: groupsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [routesApi.reducerPath]: routesApi.reducer,
    [bannersApi.reducerPath]: bannersApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    [excursionsApi.reducerPath]: excursionsApi.reducer,
    [attractionsApi.reducerPath]: attractionsApi.reducer,
    [authenticationApi.reducerPath]: authenticationApi.reducer,
    [excursionBookingsApi.reducerPath]: excursionBookingsApi.reducer,
    [userGalleryPhotosApi.reducerPath]: userGalleryPhotosApi.reducer,
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({serializableCheck: false}).concat([
      feedbacksApi.middleware,
      regionsApi.middleware,
      postSectionsApi.middleware,
      postsApi.middleware,
      attractionsReviewApi.middleware,
      routesReviewApi.middleware,
      groupsApi.middleware,
      subgroupsApi.middleware,
      usersApi.middleware,
      routesApi.middleware,
      bannersApi.middleware,
      paymentsApi.middleware,
      excursionsApi.middleware,
      attractionsApi.middleware,
      authenticationApi.middleware,
      excursionBookingsApi.middleware,
      userGalleryPhotosApi.middleware,
    ])
  },
})

export type AppState = ReturnType<typeof store.getState>

export default store
