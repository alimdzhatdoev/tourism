import {createApi} from '@reduxjs/toolkit/query/react'
import {axiosBaseQuery} from '@/core/services'
import {Payment} from '@/core/models'
import {AxiosResponse} from 'axios'
import {PaymentCheckRequest, PaymentCreateRequest} from 'types-requests'
import {PaymentCheckResponse} from 'types-responses'

export const paymentsApi = createApi({
  reducerPath: 'payments_api',
  baseQuery: axiosBaseQuery('/payments/'),
  tagTypes: ['Payments'],
  endpoints: build => ({
    createPayment: build.mutation<AxiosResponse<Payment>, PaymentCreateRequest>(
      {
        query: data => ({url: '', method: 'POST', data}),
        transformResponse: (response: AxiosResponse<Payment>) => {
          response.data = new Payment(response.data)
          return response
        },
      },
    ),
    checkPayment: build.query<
      AxiosResponse<PaymentCheckResponse>,
      PaymentCheckRequest
    >({
      query: ({id, ...data}) => ({
        url: `${id}/check-payment/`,
        method: 'POST',
        data,
      }),
      providesTags: (_, __, {id}) => [{type: 'Payments', id}],
    }),
  }),
})

export const {useCreatePaymentMutation} = paymentsApi

export default paymentsApi
