import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  RouteStopCreateRequest,
  RouteStopDeleteRequest,
  RouteStopReadRequest,
  RouteStopUpdateRequest,
  ListRequest,
} from '@app/core/types/requests';
import { RouteStopCRUResponse, ListResponse } from '@app/core/types/responses';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import RouteStop, {
  RouteStopExpand,
  RouteStopFilters,
} from '@app/core/models/RouteStop';

export const routeStopsApi = createApi({
  reducerPath: API_REDUCERS_ENUM.ROUTE_STOPS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Route Stops'],
  endpoints: build => ({
    getRouteStopsList: build.query<
      AxiosResponse<ListResponse<RouteStop>>,
      ListRequest<RouteStopExpand, Partial<RouteStopFilters>>
    >({
      query: ({ expand, filters, ...params }) => ({
        url: 'route_stops/',
        method: 'GET',
        params: { expand: expand?.join(','), ...filters, ...params },
      }),
      transformResponse: (response: AxiosResponse<ListResponse<RouteStop>>) => {
        response.data.results = response.data.results.map(
          u => new RouteStop(u),
        );
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Route Stops', id } as const),
              ),
            ]
          : [{ type: 'Route Stops', id: 'LIST' }],
    }),
    getRouteStop: build.query<
      AxiosResponse<RouteStopCRUResponse>,
      RouteStopReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `route_stops/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<RouteStopCRUResponse>) => {
        response.data = new RouteStop(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Route Stops', id }],
    }),
    createRouteStop: build.mutation<
      AxiosResponse<RouteStopCRUResponse>,
      RouteStopCreateRequest
    >({
      query: data => ({
        url: 'route_stops/',
        method: 'POST',
        data,
      }),
      transformResponse: (response: AxiosResponse<RouteStopCRUResponse>) => {
        response.data = new RouteStop(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Route Stops', id: 'LIST' }],
    }),
    updateRouteStop: build.mutation<
      AxiosResponse<RouteStopCRUResponse>,
      RouteStopUpdateRequest
    >({
      query: data => ({
        url: `route_stops/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          routeStopsApi.util.updateQueryData(
            'getRouteStop',
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
      transformResponse: (response: AxiosResponse<RouteStopCRUResponse>) => {
        response.data = new RouteStop(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Route Stops', id }],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteRouteStop: build.mutation<AxiosResponse, RouteStopDeleteRequest>({
      query: data => ({
        url: `route_stops/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Route Stops', id }],
    }),
  }),
});

export const {
  useCreateRouteStopMutation,
  useDeleteRouteStopMutation,
  useGetRouteStopQuery,
  useGetRouteStopsListQuery,
  useLazyGetRouteStopQuery,
  useLazyGetRouteStopsListQuery,
  useUpdateRouteStopMutation,
} = routeStopsApi;

export default routeStopsApi;
