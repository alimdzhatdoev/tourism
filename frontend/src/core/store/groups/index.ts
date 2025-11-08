import {createApi} from '@reduxjs/toolkit/query/react'
import {AxiosResponse} from 'axios'
import {axiosBaseQuery} from '@/core/services'
import {ListResponse} from 'types-responses'
import {Group} from '@/core/models'
import {ListRequest, ReadRequest} from 'types-requests'
import {GroupExpand} from '@/core/models/Group'
import {prepareExpand} from '@/core/utils'

export const groupsApi = createApi({
  reducerPath: 'groups_api',
  baseQuery: axiosBaseQuery('/groups/'),
  tagTypes: ['Groups'],
  endpoints: build => ({
    getGroupsList: build.query<
      AxiosResponse<ListResponse<Group>>,
      ListRequest<GroupExpand>
    >({
      query: ({expand, ...params}) => ({
        url: '',
        method: 'GET',
        params: {expand: prepareExpand(expand), ...params},
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Group>>) => {
        response.data.results = response.data.results.map(u => new Group(u))
        return response
      },
      providesTags: res =>
        res?.data.results.length
          ? [...res.data.results.map(({id}) => ({type: 'Groups', id} as const))]
          : [{type: 'Groups', id: 'LIST'}],
    }),
    getGroup: build.query<
      AxiosResponse<Group>,
      ReadRequest<GroupExpand, Group>
    >({
      query: ({id, expand, ...params}) => ({
        url: `${id}/`,
        method: 'GET',
        params: {expand: prepareExpand(expand), ...params},
      }),
      transformResponse: (response: AxiosResponse<Group>) => {
        response.data = new Group(response.data)
        return response
      },
      providesTags: (_, __, {id}) => [{type: 'Groups', id}],
    }),
  }),
})

export const {
  useGetGroupQuery,
  useGetGroupsListQuery,
  useLazyGetGroupQuery,
  useLazyGetGroupsListQuery,
} = groupsApi

export default groupsApi
