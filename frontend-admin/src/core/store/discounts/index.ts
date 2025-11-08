import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  DiscountCreateRequest,
  DiscountDeleteRequest,
  DiscountReadRequest,
  DiscountUpdateRequest,
  ListRequest,
} from '@app/core/types/requests';
import { DiscountCRUResponse, ListResponse } from '@app/core/types/responses';
import Discount, { DiscountExpand } from '@app/core/models/Discount';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';

export const discountsApi = createApi({
  reducerPath: API_REDUCERS_ENUM.DISCOUNTS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Discounts'],
  endpoints: build => ({
    getDiscountsList: build.query<
      AxiosResponse<ListResponse<Discount>>,
      ListRequest<DiscountExpand>
    >({
      query: ({ expand, ...params }) => ({
        url: 'discounts/',
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Discount>>) => {
        response.data.results = response.data.results.map(u => new Discount(u));
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Discounts', id } as const),
              ),
            ]
          : [{ type: 'Discounts', id: 'LIST' }],
    }),
    getDiscount: build.query<
      AxiosResponse<DiscountCRUResponse>,
      DiscountReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `discounts/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<DiscountCRUResponse>) => {
        response.data = new Discount(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Discounts', id }],
    }),
    createDiscount: build.mutation<
      AxiosResponse<DiscountCRUResponse>,
      DiscountCreateRequest
    >({
      query: data => ({
        url: 'discounts/',
        method: 'POST',
        data,
      }),
      transformResponse: (response: AxiosResponse<DiscountCRUResponse>) => {
        response.data = new Discount(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Discounts', id: 'LIST' }],
    }),
    updateDiscount: build.mutation<
      AxiosResponse<DiscountCRUResponse>,
      DiscountUpdateRequest
    >({
      query: data => ({
        url: `discounts/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          discountsApi.util.updateQueryData(
            'getDiscount',
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
      transformResponse: (response: AxiosResponse<DiscountCRUResponse>) => {
        response.data = new Discount(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Discounts', id }],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteDiscount: build.mutation<AxiosResponse, DiscountDeleteRequest>({
      query: data => ({
        url: `discounts/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Discounts', id }],
    }),
  }),
});

export const {
  useGetDiscountsListQuery,
  useLazyGetDiscountsListQuery,
  useGetDiscountQuery,
  useLazyGetDiscountQuery,
  useCreateDiscountMutation,
  useDeleteDiscountMutation,
  useUpdateDiscountMutation,
} = discountsApi;

export default discountsApi;
