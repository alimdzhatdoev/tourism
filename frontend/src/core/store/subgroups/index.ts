import {createApi} from '@reduxjs/toolkit/query/react'
import {AxiosResponse} from 'axios'
import {ListResponse} from 'types-responses'
import {Subgroup} from '@/core/models'
import {axiosBaseQuery} from '@/core/services'
import {ListRequest, ReadRequest} from 'types-requests'

export const subgroupsApi = createApi({
  reducerPath: 'subgroups_api',
  baseQuery: axiosBaseQuery('/subgroups/'),
  tagTypes: ['Subgroups'],
  endpoints: build => ({
    getSubgroupsList: build.query<
      AxiosResponse<ListResponse<Subgroup>>,
      ListRequest<void>
    >({
      query: ({...params}) => ({
        url: '',
        method: 'GET',
        params,
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Subgroup>>) => {
        response.data.results = response.data.results.map(u => new Subgroup(u))
        return response
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({id}) => ({type: 'Subgroups', id} as const),
              ),
            ]
          : [{type: 'Subgroups', id: 'LIST'}],
    }),
    getSubgroup: build.query<AxiosResponse<Subgroup>, ReadRequest<Subgroup>>({
      query: ({id, ...params}) => ({
        url: `${id}/`,
        method: 'GET',
        params,
      }),
      transformResponse: (response: AxiosResponse<Subgroup>) => {
        response.data = new Subgroup(response.data)
        return response
      },
      providesTags: (_, __, {id}) => [{type: 'Subgroups', id}],
    }),
  }),
})

export const {
  useGetSubgroupQuery,
  useGetSubgroupsListQuery,
  useLazyGetSubgroupQuery,
  useLazyGetSubgroupsListQuery,
} = subgroupsApi

export default subgroupsApi
