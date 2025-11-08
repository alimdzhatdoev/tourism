import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  ListRequest,
  AttractionReviewReadRequest,
  AttractionReviewCreateRequest,
  AttractionReviewUpdateRequest,
  AttractionReviewDeleteRequest,
} from '@app/core/types/requests';
import {
  AttractionReviewCRUResponse,
  ListResponse,
} from '@app/core/types/responses';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import AttractionReview, {
  AttractionReviewExpand,
  AttractionReviewFilters,
} from '@app/core/models/AttractionReview';

export const attractionsReviewApi = createApi({
  reducerPath: API_REDUCERS_ENUM.ATTRACTIONS_REVIEWS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Attraction Reviews'],
  endpoints: build => ({
    getAttractionReviewsList: build.query<
      AxiosResponse<ListResponse<AttractionReview>>,
      ListRequest<AttractionReviewExpand, Partial<AttractionReviewFilters>>
    >({
      query: ({ expand, filters, ...params }) => ({
        url: 'attraction_reviews/',
        method: 'GET',
        params: { expand: expand?.join(','), ...filters, ...params },
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<AttractionReview>>,
      ) => {
        response.data.results = response.data.results.map(
          u => new AttractionReview(u),
        );
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Attraction Reviews', id } as const),
              ),
            ]
          : [{ type: 'Attraction Reviews', id: 'LIST' }],
    }),
    getAttractionReview: build.query<
      AxiosResponse<AttractionReviewCRUResponse>,
      AttractionReviewReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `attraction_reviews/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (
        response: AxiosResponse<AttractionReviewCRUResponse>,
      ) => {
        response.data = new AttractionReview(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Attraction Reviews', id }],
    }),
    createAttractionReview: build.mutation<
      AxiosResponse<AttractionReviewCRUResponse>,
      AttractionReviewCreateRequest
    >({
      query: data => ({
        url: 'attraction_reviews/',
        method: 'POST',
        data,
      }),
      transformResponse: (
        response: AxiosResponse<AttractionReviewCRUResponse>,
      ) => {
        response.data = new AttractionReview(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Attraction Reviews', id: 'LIST' }],
    }),
    updateAttractionReview: build.mutation<
      AxiosResponse<AttractionReviewCRUResponse>,
      AttractionReviewUpdateRequest
    >({
      query: data => ({
        url: `attraction_reviews/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          attractionsReviewApi.util.updateQueryData(
            'getAttractionReview',
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
        response: AxiosResponse<AttractionReviewCRUResponse>,
      ) => {
        response.data = new AttractionReview(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Attraction Reviews', id }],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteAttractionReview: build.mutation<
      AxiosResponse,
      AttractionReviewDeleteRequest
    >({
      query: data => ({
        url: `attraction_reviews/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Attraction Reviews', id }],
    }),
  }),
});

export const {
  useGetAttractionReviewsListQuery,
  useLazyGetAttractionReviewsListQuery,
  useGetAttractionReviewQuery,
  useLazyGetAttractionReviewQuery,
  useCreateAttractionReviewMutation,
  useDeleteAttractionReviewMutation,
  useUpdateAttractionReviewMutation,
} = attractionsReviewApi;

export default attractionsReviewApi;
