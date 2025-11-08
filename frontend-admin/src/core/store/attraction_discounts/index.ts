import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  AttractionDiscountCreateRequest,
  AttractionDiscountDeleteRequest,
  AttractionDiscountReadRequest,
  AttractionDiscountUpdateRequest,
  ListRequest,
} from '@app/core/types/requests';
import {
  AttractionDiscountCRUResponse,
  ListResponse,
} from '@app/core/types/responses';
import AttractionDiscount, {
  AttractionDiscountExpand,
  AttractionDiscountFilters,
} from '@app/core/models/AttractionDiscount';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';

export const attractionDiscountsApi = createApi({
  reducerPath: API_REDUCERS_ENUM.ATTRACTION_DISCOUNTS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Attraction Discounts'],
  endpoints: build => ({
    getAttractionDiscountsList: build.query<
      AxiosResponse<ListResponse<AttractionDiscount>>,
      ListRequest<AttractionDiscountExpand, Partial<AttractionDiscountFilters>>
    >({
      query: ({ expand, filters, ...params }) => ({
        url: 'attraction_discounts/',
        method: 'GET',
        params: { expand: expand?.join(','), ...filters, ...params },
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<AttractionDiscount>>,
      ) => {
        response.data.results = response.data.results.map(
          u => new AttractionDiscount(u),
        );
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Attraction Discounts', id } as const),
              ),
            ]
          : [{ type: 'Attraction Discounts', id: 'LIST' }],
    }),
    getAttractionDiscount: build.query<
      AxiosResponse<AttractionDiscountCRUResponse>,
      AttractionDiscountReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `attraction_discounts/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (
        response: AxiosResponse<AttractionDiscountCRUResponse>,
      ) => {
        response.data = new AttractionDiscount(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Attraction Discounts', id }],
    }),
    createAttractionDiscount: build.mutation<
      AxiosResponse<AttractionDiscountCRUResponse>,
      AttractionDiscountCreateRequest
    >({
      query: data => ({
        url: 'attraction_discounts/',
        method: 'POST',
        data,
      }),
      transformResponse: (
        response: AxiosResponse<AttractionDiscountCRUResponse>,
      ) => {
        response.data = new AttractionDiscount(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Attraction Discounts', id: 'LIST' }],
    }),
    updateAttractionDiscount: build.mutation<
      AxiosResponse<AttractionDiscountCRUResponse>,
      AttractionDiscountUpdateRequest
    >({
      query: data => ({
        url: `attraction_discounts/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          attractionDiscountsApi.util.updateQueryData(
            'getAttractionDiscount',
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
      transformResponse: (
        response: AxiosResponse<AttractionDiscountCRUResponse>,
      ) => {
        response.data = new AttractionDiscount(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [
        { type: 'Attraction Discounts', id },
      ],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteAttractionDiscount: build.mutation<
      AxiosResponse,
      AttractionDiscountDeleteRequest
    >({
      query: data => ({
        url: `attraction_discounts/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Attraction Discounts', id },
      ],
    }),
  }),
});

export const {
  useGetAttractionDiscountsListQuery,
  useLazyGetAttractionDiscountsListQuery,
  useGetAttractionDiscountQuery,
  useLazyGetAttractionDiscountQuery,
  useCreateAttractionDiscountMutation,
  useDeleteAttractionDiscountMutation,
  useUpdateAttractionDiscountMutation,
} = attractionDiscountsApi;

export default attractionDiscountsApi;
