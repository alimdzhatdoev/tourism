import { UserGalleryPhoto } from '@app/core/models';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  ListRequest,
  UserGalleryPhotoCreateRequest,
} from '@app/core/types/requests';
import { ListResponse } from '@app/core/types/responses';
import { createApi } from '@reduxjs/toolkit/query/react';

import { AxiosResponse } from 'axios';

export const userGalleryPhotosApi = createApi({
  reducerPath: 'user_gallery_photos_api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['UserGalleryPhotos'],
  endpoints: build => ({
    getUserGalleryPhotosList: build.query<
      AxiosResponse<ListResponse<UserGalleryPhoto>>,
      ListRequest<void>
    >({
      query: params => ({
        url: 'user_gallery_photos/',
        method: 'GET',
        params,
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<UserGalleryPhoto>>,
      ) => {
        response.data.results = response.data.results.map(
          item => new UserGalleryPhoto(item),
        );
        return response;
      },
      providesTags: response =>
        response
          ? [
              ...response.data.results.map(item => ({
                type: 'UserGalleryPhotos' as const,
                id: item.id,
              })),
              'UserGalleryPhotos',
            ]
          : ['UserGalleryPhotos'],
    }),
    getUserGalleryPhoto: build.query<
      AxiosResponse<UserGalleryPhoto>,
      { id: UserGalleryPhoto['id'] }
    >({
      query: ({ id }) => ({
        url: `user_gallery_photos/${id}/`,
        method: 'GET',
      }),
      transformResponse: (response: AxiosResponse<UserGalleryPhoto>) => {
        response.data = new UserGalleryPhoto(response.data);
        return response;
      },
      providesTags: response =>
        response
          ? [
              {
                type: 'UserGalleryPhotos' as const,
                id: response.data.id,
              },
            ]
          : [],
    }),
    getPublishedUserGalleryPhotos: build.query<
      AxiosResponse<ListResponse<UserGalleryPhoto>>,
      ListRequest<void>
    >({
      query: params => ({
        url: 'user_gallery_photos/published/',
        method: 'GET',
        params,
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<UserGalleryPhoto>>,
      ) => {
        response.data.results = response.data.results.map(
          item => new UserGalleryPhoto(item),
        );
        return response;
      },
      providesTags: response =>
        response
          ? response.data.results.map(item => ({
              type: 'UserGalleryPhotos' as const,
              id: item.id,
            }))
          : ['UserGalleryPhotos'],
    }),
    createUserGalleryPhoto: build.mutation<
      AxiosResponse<UserGalleryPhoto>,
      UserGalleryPhotoCreateRequest
    >({
      query: data => ({ url: 'user_gallery_photos/', method: 'POST', data }),
      transformResponse: (response: AxiosResponse<UserGalleryPhoto>) => {
        response.data = new UserGalleryPhoto(response.data);
        return response;
      },
      invalidatesTags: () => ['UserGalleryPhotos'],
    }),
    deleteUserGalleryPhoto: build.mutation<
      AxiosResponse<void>,
      { id: UserGalleryPhoto['id'] }
    >({
      query: ({ id }) => ({
        url: `user_gallery_photos/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'UserGalleryPhotos', id }],
    }),
    publishUserGalleryPhoto: build.mutation<
      AxiosResponse<void>,
      { id: UserGalleryPhoto['id'] }
    >({
      query: ({ id }) => ({
        url: `user_gallery_photos/${id}/publish/`,
        method: 'POST',
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'UserGalleryPhotos', id }],
    }),
    unpublishUserGalleryPhoto: build.mutation<
      AxiosResponse<void>,
      { id: UserGalleryPhoto['id'] }
    >({
      query: ({ id }) => ({
        url: `user_gallery_photos/${id}/unpublish/`,
        method: 'POST',
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'UserGalleryPhotos', id }],
    }),
  }),
});

export const {
  useCreateUserGalleryPhotoMutation,
  useGetPublishedUserGalleryPhotosQuery,
  useGetUserGalleryPhotosListQuery,
  useGetUserGalleryPhotoQuery,
  usePublishUserGalleryPhotoMutation,
  useUnpublishUserGalleryPhotoMutation,
  useDeleteUserGalleryPhotoMutation,
} = userGalleryPhotosApi;
