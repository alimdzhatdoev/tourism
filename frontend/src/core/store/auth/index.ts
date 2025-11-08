import {createApi} from '@reduxjs/toolkit/query/react'
import {axiosBaseQuery} from '@/core/services'
import {AxiosResponse} from 'axios'
import {AuthenticateResponse, AuthorizeResponse} from 'types-responses'
import {AuthenticateResquest, AuthorizeRequest} from 'types-requests'

export const authApi = createApi({
  baseQuery: axiosBaseQuery('/'),
  reducerPath: 'auth',
  tagTypes: ['Auth'],
  endpoints: build => ({
    authenticate: build.mutation<
      AxiosResponse<AuthenticateResponse>,
      AuthenticateResquest
    >({
      query: data => ({
        url: 'authenticate/',
        method: 'POST',
        data,
      }),
    }),
    authorize: build.mutation<
      AxiosResponse<AuthorizeResponse>,
      AuthorizeRequest
    >({
      query: data => ({
        url: 'token/obtain/',
        method: 'POST',
        data,
      }),
    }),
  }),
})

export const {useAuthenticateMutation, useAuthorizeMutation} = authApi

export default authApi
