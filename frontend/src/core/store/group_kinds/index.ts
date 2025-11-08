import GroupKind from '@/core/models/GroupKind'
import {axiosBaseQuery} from '@/core/services'
import {createApi} from '@reduxjs/toolkit/query/react'
import {AxiosResponse} from 'axios'
import {ListRequest, ReadRequest} from 'types-requests'
import {ListResponse} from 'types-responses'

export const groupKindsApi = createApi({
  reducerPath: 'group_kinds_api',
  baseQuery: axiosBaseQuery('/group_kinds/'),
  tagTypes: ['Group Kinds'],
  endpoints: build => ({
    getGroupKindsList: build.query<
      AxiosResponse<ListResponse<GroupKind>>,
      ListRequest<void>
    >({
      query: ({...params}) => ({
        url: '',
        method: 'GET',
        params,
      }),
      transformResponse: (response: AxiosResponse<ListResponse<GroupKind>>) => {
        response.data.results = response.data.results.map(u => new GroupKind(u))
        return response
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({id}) => ({type: 'Group Kinds', id} as const),
              ),
            ]
          : [{type: 'Group Kinds', id: 'LIST'}],
    }),
    getGroupKind: build.query<AxiosResponse<GroupKind>, ReadRequest<GroupKind>>(
      {
        query: ({id, ...params}) => ({
          url: `${id}/`,
          method: 'GET',
          params,
        }),
        transformResponse: (response: AxiosResponse<GroupKind>) => {
          response.data = new GroupKind(response.data)
          return response
        },
        providesTags: (_, __, {id}) => [{type: 'Group Kinds', id}],
      },
    ),
  }),
})

export const {
  useGetGroupKindQuery,
  useGetGroupKindsListQuery,
  useLazyGetGroupKindQuery,
  useLazyGetGroupKindsListQuery,
} = groupKindsApi

export default groupKindsApi
