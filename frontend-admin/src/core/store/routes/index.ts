import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  ListRequest,
  RouteReadRequest,
  RouteCreateRequest,
  RouteUpdateRequest,
  RouteDeleteRequest,
} from '@app/core/types/requests';
import { RouteCRUResponse, ListResponse } from '@app/core/types/responses';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import Route, { RouteExpand, RouteFilters } from '@app/core/models/Route';

export const routesApi = createApi({
  reducerPath: API_REDUCERS_ENUM.ROUTES,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Routes'],
  endpoints: build => ({
    getRoutesList: build.query<
      AxiosResponse<ListResponse<Route>>,
      ListRequest<RouteExpand, Partial<RouteFilters>>
    >({
      query: ({ expand, filters, ...params }) => ({
        url: 'routes/',
        method: 'GET',
        params: { expand: expand?.join(','), ...filters, ...params },
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Route>>) => {
        response.data.results = response.data.results.map(u => new Route(u));
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Routes', id } as const),
              ),
            ]
          : [{ type: 'Routes', id: 'LIST' }],
    }),
    getRoute: build.query<AxiosResponse<RouteCRUResponse>, RouteReadRequest>({
      query: ({ id, expand, ...params }) => ({
        url: `routes/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<RouteCRUResponse>) => {
        response.data = new Route(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Routes', id }],
    }),
    createRoute: build.mutation<
      AxiosResponse<RouteCRUResponse>,
      RouteCreateRequest
    >({
      query: data => ({
        url: 'routes/',
        method: 'POST',
        data,
      }),
      transformResponse: (response: AxiosResponse<RouteCRUResponse>) => {
        response.data = new Route(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Routes', id: 'LIST' }],
    }),
    updateRoute: build.mutation<
      AxiosResponse<RouteCRUResponse>,
      RouteUpdateRequest
    >({
      query: data => ({
        url: `routes/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          routesApi.util.updateQueryData(
            'getRoute',
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
      transformResponse: (response: AxiosResponse<RouteCRUResponse>) => {
        response.data = new Route(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Routes', id }],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteRoute: build.mutation<AxiosResponse, RouteDeleteRequest>({
      query: data => ({
        url: `routes/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Routes', id }],
    }),
  }),
});

export const {
  useGetRoutesListQuery,
  useLazyGetRoutesListQuery,
  useGetRouteQuery,
  useLazyGetRouteQuery,
  useCreateRouteMutation,
  useDeleteRouteMutation,
  useUpdateRouteMutation,
} = routesApi;

export default routesApi;
