import {createApi} from '@reduxjs/toolkit/query/react'
import {AxiosResponse} from 'axios'
import {axiosBaseQuery} from '@/core/services'
import {ListRequest} from 'types-requests'
import {ListResponse} from 'types-responses'
import Post, {PostsFilters} from '@/core/models/Post'

export const postsApi = createApi({
  reducerPath: 'posts_api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Posts'],
  endpoints: build => ({
    getPostsList: build.query<
      AxiosResponse<ListResponse<Post>>,
      ListRequest<void, PostsFilters>
    >({
      query: ({filters, ...params}) => ({
        url: '/posts/published/',
        method: 'GET',
        params: {
          ...filters,
          ...params,
        },
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Post>>) => {
        response.data.results = response.data.results.map(u => new Post(u))
        return response
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(({id}) => ({type: 'Posts', id} as const)),
              'Posts',
            ]
          : ['Posts'],
    }),
    getPost: build.query<AxiosResponse<Post>, {id: Post['id']}>({
      query: ({id, ...params}) => ({
        url: `/posts/${id}/`,
        method: 'GET',
        params,
      }),
      transformResponse: (response: AxiosResponse<Post>) => {
        response.data = new Post(response.data)
        return response
      },
      providesTags: (_, __, {id}) => [{type: 'Posts', id}],
    }),
  }),
})

export const {useGetPostQuery, useGetPostsListQuery} = postsApi

export default postsApi
