import { User } from '@app/core/models';
import { initAxiosInstance } from '@app/core/services/api';
import { setUserState } from '@app/core/store/user/actions';
import {
  useRefreshTokenMutation,
  useLazyGetMeQuery,
} from '@app/core/store/users';
import { useStorage } from '@app/hooks';
import React, { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { FullscreenPreloader } from '../Preloaders';
import { PrivateRoute } from '../PrivateRoute';

export enum SYSTEM_ROUTES_ENUM {
  MAIN = '/',
  NOT_FOUND = '/*',
}

export enum UI_ROUTES_ENUM {
  ANALYTICS = '/analytics',
  ATTRACTIONS = '/attractions',
  ATTRACTIONS_WITH_ID = '/attractions/:id',
  NEW_ATTRACTION = '/attractions/new',
  ROUTES = '/routes',
  ROUTES_WITH_ID = '/routes/:id',
  NEW_ROUTE = '/routes/new',
  BANNERS = '/banners',
  USERS = '/users',
  REVIEWS = '/reviews',
  BOOKINGS = '/bookings',
  BOOKINGS_WITH_ID = '/bookings/:id',
  EXCURSIONS = '/excursions',
  EXCURSIONS_WITH_ID = '/excursions/:id',
  CHATS = '/chats',
  POSTS = '/posts',
  POSTS_ID = '/posts/:id',
  USERS_GALLERY = '/users-gallery',
  FEEDBACKS = '/feedbacks',
  FEEDBACKS_WITH_ID = '/feedbacks/:id',
}

type RouteItem<T> = {
  path: T;
  Component: React.FC;
  isProtected?: boolean;
  icon?: React.FC;
};

const ROUTES: RouteItem<SYSTEM_ROUTES_ENUM | UI_ROUTES_ENUM>[] = [
  {
    path: SYSTEM_ROUTES_ENUM.MAIN,
    Component: lazy(() => import('@app/ui/pages/login')),
  },
  {
    path: UI_ROUTES_ENUM.ANALYTICS,
    Component: lazy(() => import('@app/ui/pages/analytics')),
    isProtected: true,
  },
  {
    path: UI_ROUTES_ENUM.ATTRACTIONS,
    Component: lazy(() => import('@app/ui/pages/attractions')),
    isProtected: true,
  },
  {
    path: UI_ROUTES_ENUM.ATTRACTIONS_WITH_ID,
    Component: lazy(() => import('@app/ui/pages/attractions/attraction_view')),
    isProtected: true,
  },
  {
    path: UI_ROUTES_ENUM.NEW_ATTRACTION,
    Component: lazy(() => import('@app/ui/pages/attractions/attraction_new')),
    isProtected: true,
  },
  {
    path: UI_ROUTES_ENUM.ROUTES,
    Component: lazy(() => import('@app/ui/pages/routes')),
    isProtected: true,
  },
  {
    path: UI_ROUTES_ENUM.ROUTES_WITH_ID,
    Component: lazy(() => import('@app/ui/pages/routes/route_view')),
    isProtected: true,
  },
  {
    path: UI_ROUTES_ENUM.NEW_ROUTE,
    Component: lazy(() => import('@app/ui/pages/routes/route_new')),
    isProtected: true,
  },
  {
    path: UI_ROUTES_ENUM.BANNERS,
    Component: lazy(() => import('@app/ui/pages/banners')),
    isProtected: true,
  },
  {
    path: UI_ROUTES_ENUM.USERS,
    Component: lazy(() => import('@app/ui/pages/users')),
    isProtected: true,
  },
  {
    path: UI_ROUTES_ENUM.REVIEWS,
    Component: lazy(() => import('@app/ui/pages/reviews')),
    isProtected: true,
  },
  {
    path: UI_ROUTES_ENUM.BOOKINGS,
    Component: lazy(() => import('@app/ui/pages/bookings')),
    isProtected: true,
  },
  {
    path: UI_ROUTES_ENUM.BOOKINGS_WITH_ID,
    Component: lazy(() => import('@app/ui/pages/bookings/booking_edit')),
    isProtected: true,
  },
  {
    path: SYSTEM_ROUTES_ENUM.NOT_FOUND,
    Component: lazy(() => import('@app/ui/pages/not_found')),
  },
  {
    path: UI_ROUTES_ENUM.EXCURSIONS,
    Component: lazy(() => import('@app/ui/pages/excursions/')),
    isProtected: true,
  },
  {
    path: UI_ROUTES_ENUM.EXCURSIONS_WITH_ID,
    Component: lazy(() => import('@app/ui/pages/excursions/excursion_edit')),
    isProtected: true,
  },
  {
    path: UI_ROUTES_ENUM.CHATS,
    Component: lazy(() => import('@app/ui/pages/chats/')),
    isProtected: true,
  },
  {
    path: UI_ROUTES_ENUM.POSTS,
    Component: lazy(() => import('@app/ui/pages/posts')),
    isProtected: true,
  },
  {
    path: UI_ROUTES_ENUM.POSTS_ID,
    Component: lazy(() => import('@app/ui/pages/posts/[id]')),
    isProtected: true,
  },
  {
    path: UI_ROUTES_ENUM.USERS_GALLERY,
    Component: lazy(() => import('@app/ui/pages/users_gallery')),
    isProtected: true,
  },
  {
    path: UI_ROUTES_ENUM.FEEDBACKS,
    Component: lazy(() => import('@app/ui/pages/feedbacks')),
    isProtected: true,
  },
  {
    path: UI_ROUTES_ENUM.FEEDBACKS_WITH_ID,
    Component: lazy(() => import('@app/ui/pages/feedbacks/[id]')),
    isProtected: true,
  },
];

export const Router: React.FC = () => {
  const navigate = useNavigate();
  const [refreshTokenApi] = useRefreshTokenMutation();
  const [getMeApi] = useLazyGetMeQuery();
  const { readStorage, writeStorage, clearStorage } = useStorage();

  useEffect(() => {
    const loadApp = async () => {
      const tokenPair = readStorage();
      if (!tokenPair) {
        clearStorage();
        navigate(SYSTEM_ROUTES_ENUM.MAIN);
        return;
      }

      try {
        const { refresh: refreshToken } = JSON.parse(tokenPair);
        const {
          data: { access, refresh },
        } = await refreshTokenApi({ refresh: refreshToken }).unwrap();
        writeStorage(JSON.stringify({ access, refresh }));
        initAxiosInstance();
        const { data } = await getMeApi({}).unwrap();
        setUserState({ user: data as User, accessToken: access });
      } catch (error) {
        console.error(error);
        clearStorage();
        navigate(SYSTEM_ROUTES_ENUM.MAIN);
      }
    };

    loadApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      {ROUTES.map(({ isProtected, path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={<FullscreenPreloader />}>
              {isProtected ? (
                <PrivateRoute>
                  <Component />
                </PrivateRoute>
              ) : (
                <Component />
              )}
            </Suspense>
          }
        />
      ))}
    </Routes>
  );
};
