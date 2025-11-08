import {ExcursionBooking} from '@/core/models'
import {
  ExcursionBookingExpand,
  ExcursionBookingsFilters,
} from '@/core/models/ExcursionBooking'
import {axiosBaseQuery} from '@/core/services'
import {prepareExpand} from '@/core/utils'
import {createApi} from '@reduxjs/toolkit/query/react'
import {AxiosResponse} from 'axios'
import {ExcursionBookingCreateRequest, ListRequest} from 'types-requests'
import {ListResponse} from 'types-responses'

export const excursionBookingsApi = createApi({
  baseQuery: axiosBaseQuery('/excursion_bookings/'),
  reducerPath: 'excursion_bookings_api',
  tagTypes: ['Excursion Bookings'],
  endpoints: build => ({
    getExcursionBookingsList: build.query<
      AxiosResponse<ListResponse<ExcursionBooking>>,
      ListRequest<ExcursionBookingExpand, Partial<ExcursionBookingsFilters>>
    >({
      query: ({expand, filters, ...params}) => ({
        url: '',
        method: 'GET',
        params: {expand: prepareExpand(expand), ...filters, ...params},
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<ExcursionBooking>>,
      ) => {
        response.data.results = response.data.results.map(
          u => new ExcursionBooking(u),
        )
        return response
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({id}) => ({type: 'Excursion Bookings', id} as const),
              ),
            ]
          : [{type: 'Excursion Bookings', id: 'LIST'}],
    }),
    createExcursionBooking: build.mutation<
      AxiosResponse<ExcursionBooking>,
      ExcursionBookingCreateRequest
    >({
      query: data => ({
        url: '',
        method: 'POST',
        data,
      }),
      transformResponse: (response: AxiosResponse<ExcursionBooking>) => {
        response.data = new ExcursionBooking(response.data)
        return response
      },
    }),
  }),
})

export const {
  useCreateExcursionBookingMutation,
  useGetExcursionBookingsListQuery,
  useLazyGetExcursionBookingsListQuery,
} = excursionBookingsApi

export default excursionBookingsApi
