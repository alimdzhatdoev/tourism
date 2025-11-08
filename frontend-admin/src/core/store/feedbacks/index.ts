import Feedback from '@app/core/models/Feedback';
import { axiosBaseQuery } from '@app/core/services/api';
import { FeedbackCreateRequest, ListRequest } from '@app/core/types/requests';
import { ListResponse } from '@app/core/types/responses';
import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';

export const feedbacksApi = createApi({
  reducerPath: 'feedbacks_api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Feedbacks'],
  endpoints: build => ({
    getFeedbacksList: build.query<
      AxiosResponse<ListResponse<Feedback>>,
      ListRequest<void, void>
    >({
      query: params => ({
        url: 'feedbacks/',
        method: 'GET',
        params,
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Feedback>>) => {
        response.data.results = response.data.results.map(u => new Feedback(u));
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Feedbacks', id } as const),
              ),
              'Feedbacks',
            ]
          : ['Feedbacks'],
    }),
    getFeedback: build.query<AxiosResponse<Feedback>, { id: Feedback['id'] }>({
      query: ({ id, ...params }) => ({
        url: `feedbacks/${id}/`,
        method: 'GET',
        params,
      }),
      transformResponse: (response: AxiosResponse<Feedback>) => {
        response.data = new Feedback(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Feedbacks', id }],
    }),
    createFeedback: build.mutation<
      AxiosResponse<Feedback>,
      FeedbackCreateRequest
    >({
      query: data => ({ url: 'feedbacks/', method: 'POST', data }),
      transformResponse: (response: AxiosResponse<Feedback>) => {
        response.data = new Feedback(response.data);
        return response;
      },
      invalidatesTags: ['Feedbacks'],
    }),
    setFeedbackSeen: build.mutation<
      AxiosResponse<void>,
      { id: Feedback['id'] }
    >({
      query: ({ id }) => ({
        url: `feedbacks/${id}/see/`,
        method: 'POST',
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Feedbacks', id }],
    }),
  }),
});

export const {
  useGetFeedbacksListQuery,
  useGetFeedbackQuery,
  useCreateFeedbackMutation,
  useSetFeedbackSeenMutation,
} = feedbacksApi;

export default feedbacksApi;
