import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  RoutePhotoCreateRequest,
  RoutePhotoDeleteRequest,
  RoutePhotoReadRequest,
  RoutePhotoUpdateRequest,
  ListRequest,
} from '@app/core/types/requests';
import { RoutePhotoCRUResponse, ListResponse } from '@app/core/types/responses';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import RoutePhoto, { RoutePhotoExpand } from '@app/core/models/RoutePhoto';

export const routesPhotosApi = createApi({
  reducerPath: API_REDUCERS_ENUM.ROUTE_PHOTOS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Route Photos'],
  endpoints: build => ({
    getRoutePhotosList: build.query<
      AxiosResponse<ListResponse<RoutePhoto>>,
      ListRequest<RoutePhotoExpand>
    >({
      query: ({ expand, ...params }) => ({
        url: 'route_photos/',
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<RoutePhoto>>,
      ) => {
        response.data.results = response.data.results.map(
          u => new RoutePhoto(u),
        );
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Route Photos', id } as const),
              ),
            ]
          : [{ type: 'Route Photos', id: 'LIST' }],
    }),
    getRoutePhoto: build.query<
      AxiosResponse<RoutePhotoCRUResponse>,
      RoutePhotoReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `route_photos/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<RoutePhotoCRUResponse>) => {
        response.data = new RoutePhoto(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Route Photos', id }],
    }),
    createRoutePhoto: build.mutation<
      AxiosResponse<RoutePhotoCRUResponse>,
      RoutePhotoCreateRequest
    >({
      query: data => ({
        url: 'route_photos/',
        method: 'POST',
        data,
      }),
      transformResponse: (response: AxiosResponse<RoutePhotoCRUResponse>) => {
        response.data = new RoutePhoto(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Route Photos', id: 'LIST' }],
    }),
    updateRoutePhoto: build.mutation<
      AxiosResponse<RoutePhotoCRUResponse>,
      RoutePhotoUpdateRequest
    >({
      query: data => ({
        url: `route_photos/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          routesPhotosApi.util.updateQueryData(
            'getRoutePhoto',
            { id: requestBody.id },
            draft => {
              Object.assign(draft, requestBody);
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchRes.undo();
        }
      },
      transformResponse: (response: AxiosResponse<RoutePhotoCRUResponse>) => {
        response.data = new RoutePhoto(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Route Photos', id }],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteRoutePhoto: build.mutation<AxiosResponse, RoutePhotoDeleteRequest>({
      query: data => ({
        url: `route_photos/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Route Photos', id }],
    }),
  }),
});

export const {
  useCreateRoutePhotoMutation,
  useDeleteRoutePhotoMutation,
  useGetRoutePhotoQuery,
  useGetRoutePhotosListQuery,
  useLazyGetRoutePhotoQuery,
  useLazyGetRoutePhotosListQuery,
  useUpdateRoutePhotoMutation,
} = routesPhotosApi;

export default routesPhotosApi;
