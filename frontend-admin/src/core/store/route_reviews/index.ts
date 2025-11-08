import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  ListRequest,
  RouteReviewReadRequest,
  RouteReviewCreateRequest,
  RouteReviewUpdateRequest,
  RouteReviewDeleteRequest,
} from '@app/core/types/requests';
import {
  RouteReviewCRUResponse,
  ListResponse,
} from '@app/core/types/responses';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import RouteReview, {
  RouteReviewExpand,
  RouteReviewFilters,
} from '@app/core/models/RouteReview';

export const routesReviewsApi = createApi({
  reducerPath: API_REDUCERS_ENUM.ROUTE_REVIEWS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Route Reviews'],
  endpoints: build => ({
    getRouteReviewsList: build.query<
      AxiosResponse<ListResponse<RouteReview>>,
      ListRequest<RouteReviewExpand, Partial<RouteReviewFilters>>
    >({
      query: ({ expand, filters, ...params }) => ({
        url: 'route_reviews/',
        method: 'GET',
        params: { expand: expand?.join(','), ...filters, ...params },
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<RouteReview>>,
      ) => {
        response.data.results = response.data.results.map(
          u => new RouteReview(u),
        );
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Route Reviews', id } as const),
              ),
            ]
          : [{ type: 'Route Reviews', id: 'LIST' }],
    }),
    getRouteReview: build.query<
      AxiosResponse<RouteReviewCRUResponse>,
      RouteReviewReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `route_reviews/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<RouteReviewCRUResponse>) => {
        response.data = new RouteReview(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Route Reviews', id }],
    }),
    createRouteReview: build.mutation<
      AxiosResponse<RouteReviewCRUResponse>,
      RouteReviewCreateRequest
    >({
      query: data => ({
        url: 'route_reviews/',
        method: 'POST',
        data,
      }),
      transformResponse: (response: AxiosResponse<RouteReviewCRUResponse>) => {
        response.data = new RouteReview(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Route Reviews', id: 'LIST' }],
    }),
    updateRouteReview: build.mutation<
      AxiosResponse<RouteReviewCRUResponse>,
      RouteReviewUpdateRequest
    >({
      query: data => ({
        url: `route_reviews/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          routesReviewsApi.util.updateQueryData(
            'getRouteReview',
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
      transformResponse: (response: AxiosResponse<RouteReviewCRUResponse>) => {
        response.data = new RouteReview(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Route Reviews', id }],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteRouteReview: build.mutation<AxiosResponse, RouteReviewDeleteRequest>({
      query: data => ({
        url: `route_reviews/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Route Reviews', id }],
    }),
  }),
});

export const {
  useGetRouteReviewsListQuery,
  useLazyGetRouteReviewsListQuery,
  useGetRouteReviewQuery,
  useLazyGetRouteReviewQuery,
  useCreateRouteReviewMutation,
  useDeleteRouteReviewMutation,
  useUpdateRouteReviewMutation,
} = routesReviewsApi;

export default routesReviewsApi;
