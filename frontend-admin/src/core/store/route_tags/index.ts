import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  RouteTagCreateRequest,
  RouteTagDeleteRequest,
  RouteTagReadRequest,
  RouteTagUpdateRequest,
  ListRequest,
} from '@app/core/types/requests';
import { RouteTagCRUResponse, ListResponse } from '@app/core/types/responses';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import RouteTag, { RouteTagExpand } from '@app/core/models/RouteTag';

export const routeTagsApi = createApi({
  reducerPath: API_REDUCERS_ENUM.ROUTE_TAGS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Route Tags'],
  endpoints: build => ({
    getRouteTagsList: build.query<
      AxiosResponse<ListResponse<RouteTag>>,
      ListRequest<RouteTagExpand>
    >({
      query: ({ expand, ...params }) => ({
        url: 'route_tags/',
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<ListResponse<RouteTag>>) => {
        response.data.results = response.data.results.map(u => new RouteTag(u));
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Route Tags', id } as const),
              ),
            ]
          : [{ type: 'Route Tags', id: 'LIST' }],
    }),
    getRouteTag: build.query<
      AxiosResponse<RouteTagCRUResponse>,
      RouteTagReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `route_tags/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<RouteTagCRUResponse>) => {
        response.data = new RouteTag(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Route Tags', id }],
    }),
    createRouteTag: build.mutation<
      AxiosResponse<RouteTagCRUResponse>,
      RouteTagCreateRequest
    >({
      query: data => ({
        url: 'route_tags/',
        method: 'POST',
        data,
      }),
      transformResponse: (response: AxiosResponse<RouteTagCRUResponse>) => {
        response.data = new RouteTag(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Route Tags', id: 'LIST' }],
    }),
    updateRouteTag: build.mutation<
      AxiosResponse<RouteTagCRUResponse>,
      RouteTagUpdateRequest
    >({
      query: data => ({
        url: `route_tags/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          routeTagsApi.util.updateQueryData(
            'getRouteTag',
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
      transformResponse: (response: AxiosResponse<RouteTagCRUResponse>) => {
        response.data = new RouteTag(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Route Tags', id }],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteRouteTag: build.mutation<AxiosResponse, RouteTagDeleteRequest>({
      query: data => ({
        url: `route_tags/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Route Tags', id }],
    }),
  }),
});

export const {
  useCreateRouteTagMutation,
  useDeleteRouteTagMutation,
  useGetRouteTagQuery,
  useGetRouteTagsListQuery,
  useLazyGetRouteTagQuery,
  useLazyGetRouteTagsListQuery,
  useUpdateRouteTagMutation,
} = routeTagsApi;

export default routeTagsApi;
