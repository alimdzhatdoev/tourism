import {createApi} from '@reduxjs/toolkit/query/react'
import {AxiosResponse} from 'axios'
import {axiosBaseQuery} from '@/core/services'
import {FeedbackCreateRequest, ListRequest} from 'types-requests'
import {ListResponse} from 'types-responses'
import Feedback from '@/core/models/Feedback'

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
        url: '/feedbacks/',
        method: 'GET',
        params,
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Feedback>>) => {
        response.data.results = response.data.results.map(u => new Feedback(u))
        return response
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({id}) => ({type: 'Feedbacks', id} as const),
              ),
              'Feedbacks',
            ]
          : ['Feedbacks'],
    }),
    getFeedback: build.query<AxiosResponse<Feedback>, {id: Feedback['id']}>({
      query: ({id, ...params}) => ({
        url: `/feedbacks/${id}/`,
        method: 'GET',
        params,
      }),
      transformResponse: (response: AxiosResponse<Feedback>) => {
        response.data = new Feedback(response.data)
        return response
      },
      providesTags: (_, __, {id}) => [{type: 'Feedbacks', id}],
    }),
    createFeedback: build.mutation<
      AxiosResponse<Feedback>,
      FeedbackCreateRequest
    >({
      query: data => ({url: '/feedbacks/', method: 'POST', data}),
      transformResponse: (response: AxiosResponse<Feedback>) => {
        response.data = new Feedback(response.data)
        return response
      },
      invalidatesTags: ['Feedbacks'],
    }),
  }),
})

export const {
  useGetFeedbacksListQuery,
  useGetFeedbackQuery,
  useCreateFeedbackMutation,
} = feedbacksApi

export default feedbacksApi
