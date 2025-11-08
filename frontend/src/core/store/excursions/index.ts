import {createApi} from '@reduxjs/toolkit/query/react'
import {axiosBaseQuery} from '@/core/services'
import {Excursion, ExcursionExpand, ExcursionsFilters} from '@/core/models'
import {prepareExpand} from '@/core/utils'
import {AxiosResponse} from 'axios'
import {ListRequest, ReadRequest} from 'types-requests'
import {ListResponse} from 'types-responses'

export const excursionsApi = createApi({
  reducerPath: 'excursions_api',
  baseQuery: axiosBaseQuery('/excursions/'),
  tagTypes: ['Excursions'],
  endpoints: build => ({
    getExcursionsList: build.query<
      AxiosResponse<ListResponse<Excursion>>,
      ListRequest<ExcursionExpand, Partial<ExcursionsFilters>>
    >({
      query: ({expand, filters, ...params}) => ({
        url: '',
        method: 'GET',
        params: {expand: prepareExpand(expand), ...filters, ...params},
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Excursion>>) => {
        response.data.results = response.data.results.map(u => new Excursion(u))
        return response
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({id}) => ({type: 'Excursions', id} as const),
              ),
            ]
          : [{type: 'Excursions', id: 'LIST'}],
    }),
    getExcursion: build.query<
      AxiosResponse<Excursion>,
      ReadRequest<ExcursionExpand>
    >({
      query: ({id, expand, ...params}) => ({
        url: `${id}/`,
        method: 'GET',
        params: {expand: prepareExpand(expand), ...params},
      }),
      transformResponse: (response: AxiosResponse<Excursion>) => {
        response.data = new Excursion(response.data)
        return response
      },
      providesTags: (_, __, {id}) => [{type: 'Excursions', id}],
    }),
  }),
})

export const {
  useGetExcursionsListQuery,
  useLazyGetExcursionsListQuery,
  useGetExcursionQuery,
  useLazyGetExcursionQuery,
} = excursionsApi

export default excursionsApi
