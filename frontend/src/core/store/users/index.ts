import {createApi} from '@reduxjs/toolkit/query/react'
import {axiosBaseQuery} from '@/core/services'
import {AxiosResponse} from 'axios'
import {User} from '@/core/models'
import {Expand} from 'types-helpers'
import {UserExpand} from '@/core/models/User'
import {prepareExpand} from '@/core/utils'
import {ReadRequest, UserUpdateRequest} from 'types-requests'

export const usersApi = createApi({
  reducerPath: 'users_api',
  baseQuery: axiosBaseQuery('/users/'),
  tagTypes: ['Users'],
  endpoints: build => ({
    getMe: build.query<AxiosResponse<User>, {expand?: Expand<UserExpand>}>({
      query: ({expand, ...params}) => ({
        url: 'me/',
        method: 'GET',
        params: {expand: prepareExpand(expand), ...params},
      }),
      transformResponse: (response: AxiosResponse<User>) => {
        response.data = new User(response.data)
        return response
      },
      providesTags: ['Users'],
    }),
    deleteUser: build.mutation<AxiosResponse, ReadRequest<undefined, User>>({
      query: params => ({
        url: `${params.id}/`,
        method: 'DELETE',
      }),
    }),
    updateUser: build.mutation<
      AxiosResponse<User>,
      UserUpdateRequest & ReadRequest<undefined, User>
    >({
      query: ({id, ...data}) => ({
        url: `${id}/`,
        method: 'PUT',
        data,
      }),
      transformResponse: (response: AxiosResponse<User>) => {
        response.data = new User(response.data)
        return response
      },
      invalidatesTags: ['Users'],
    }),
  }),
})

export const {
  useLazyGetMeQuery,
  useGetMeQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = usersApi

export default usersApi
