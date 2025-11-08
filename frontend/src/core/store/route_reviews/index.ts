import {RouteReview} from '@/core/models'
import {axiosBaseQuery} from '@/core/services'
import {createApi} from '@reduxjs/toolkit/query/react'
import {AxiosResponse} from 'axios'
import {RouteReviewCreateRequest} from 'types-requests'
import {RouteReviewCRUResponse} from 'types-responses'
import routesApi from '../routes'

export const routesReviewApi = createApi({
  reducerPath: 'route_reviews_api',
  baseQuery: axiosBaseQuery('/route_reviews/'),
  tagTypes: ['Route Reviews'],
  endpoints: build => ({
    createRouteReview: build.mutation<
      AxiosResponse<RouteReviewCRUResponse>,
      RouteReviewCreateRequest
    >({
      query: data => ({
        url: '',
        method: 'POST',
        data,
      }),
      transformResponse: (response: AxiosResponse<RouteReviewCRUResponse>) => {
        response.data = new RouteReview(response.data)
        return response
      },
      onQueryStarted: async (_, {dispatch, queryFulfilled}) => {
        const {updateQueryData} = routesApi.util
        try {
          const {
            data: {data},
          } = await queryFulfilled
          dispatch(
            updateQueryData('getRoute', {id: data.routeId}, draft => {
              draft.data.reviewCount = draft.data.reviewCount + 1
              draft.data.reviews.unshift(new RouteReview(data) as any)
            }),
          )
        } catch (error) {
          console.error(error)
        }
      },
      invalidatesTags: [{type: 'Route Reviews', id: 'LIST'}],
    }),
  }),
})

export const {useCreateRouteReviewMutation} = routesReviewApi

export default routesReviewApi
