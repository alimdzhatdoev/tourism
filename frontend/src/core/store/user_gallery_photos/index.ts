import {createApi} from '@reduxjs/toolkit/query/react'
import {axiosBaseQuery} from '@/core/services'
import {UserGalleryPhoto} from '@/core/models'
import {AxiosResponse} from 'axios'
import {ListRequest, UserGalleryPhotoCreateRequest} from 'types-requests'
import {ListResponse} from 'types-responses'

export const userGalleryPhotosApi = createApi({
  reducerPath: 'user_gallery_photos_api',
  baseQuery: axiosBaseQuery('/user_gallery_photos/'),
  tagTypes: ['UserGalleryPhotos'],
  endpoints: build => ({
    createUserGalleryPhoto: build.mutation<
      AxiosResponse<UserGalleryPhoto>,
      UserGalleryPhotoCreateRequest
    >({
      query: data => ({url: '', method: 'POST', data}),
      transformResponse: (response: AxiosResponse<UserGalleryPhoto>) => {
        response.data = new UserGalleryPhoto(response.data)
        return response
      },
    }),
    getPublishedUserGalleryPhotos: build.query<
      AxiosResponse<ListResponse<UserGalleryPhoto>>,
      ListRequest
    >({
      query: params => ({
        url: 'published/',
        method: 'GET',
        params,
      }),
      providesTags: response =>
        response
          ? response.data.results.map(item => ({
              type: 'UserGalleryPhotos' as const,
              id: item.id,
            }))
          : ['UserGalleryPhotos'],
    }),
  }),
})

export const {
  useCreateUserGalleryPhotoMutation,
  useGetPublishedUserGalleryPhotosQuery,
} = userGalleryPhotosApi

export default userGalleryPhotosApi
