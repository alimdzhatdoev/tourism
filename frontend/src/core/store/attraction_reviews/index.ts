import {AttractionReview} from '@/core/models'
import {axiosBaseQuery} from '@/core/services'
import {createApi} from '@reduxjs/toolkit/query/react'
import {AxiosResponse} from 'axios'
import {AttractionReviewCreateRequest} from 'types-requests'
import {AttractionReviewCRUResponse} from 'types-responses'
import attractionsApi from '../attractions'

export const attractionsReviewApi = createApi({
  reducerPath: 'attraction_reviews_api',
  baseQuery: axiosBaseQuery('/attraction_reviews/'),
  tagTypes: ['Attraction Reviews'],
  endpoints: build => ({
    createAttractionReview: build.mutation<
      AxiosResponse<AttractionReviewCRUResponse>,
      AttractionReviewCreateRequest
    >({
      query: data => ({
        url: '',
        method: 'POST',
        data,
      }),
      transformResponse: (
        response: AxiosResponse<AttractionReviewCRUResponse>,
      ) => {
        response.data = new AttractionReview(response.data)
        return response
      },
      onQueryStarted: async (_, {dispatch, queryFulfilled}) => {
        const {updateQueryData} = attractionsApi.util
        try {
          const {
            data: {data},
          } = await queryFulfilled
          dispatch(
            updateQueryData('getAttraction', {id: data.attractionId}, draft => {
              draft.data.reviewCount = draft.data.reviewCount + 1
              draft.data.reviews.unshift(new AttractionReview(data) as any)
            }),
          )
        } catch (error) {
          console.error(error)
        }
      },
      invalidatesTags: [{type: 'Attraction Reviews', id: 'LIST'}],
    }),
  }),
})

export const {useCreateAttractionReviewMutation} = attractionsReviewApi

export default attractionsReviewApi
