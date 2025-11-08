import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  ListRequest,
  PostCreateRequest,
  PostUpdateRequest,
} from '@app/core/types/requests';
import { ListResponse } from '@app/core/types/responses';
import Post from '@app/core/models/Post';

export const postsApi = createApi({
  reducerPath: 'posts_api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Posts'],
  endpoints: build => ({
    getPostsList: build.query<
      AxiosResponse<ListResponse<Post>>,
      ListRequest<void>
    >({
      query: params => ({
        url: 'posts/',
        method: 'GET',
        params,
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Post>>) => {
        response.data.results = response.data.results.map(u => new Post(u));
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Posts', id } as const),
              ),
              'Posts',
            ]
          : ['Posts'],
    }),
    getPost: build.query<AxiosResponse<Post>, { id: Post['id'] }>({
      query: ({ id, ...params }) => ({
        url: `posts/${id}/`,
        method: 'GET',
        params,
      }),
      transformResponse: (response: AxiosResponse<Post>) => {
        response.data = new Post(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Posts', id }],
    }),
    createPost: build.mutation<AxiosResponse<Post>, PostCreateRequest>({
      query: data => ({
        url: 'posts/',
        method: 'POST',
        data,
      }),
      transformResponse: (response: AxiosResponse<Post>) => {
        response.data = new Post(response.data);
        return response;
      },
      invalidatesTags: ['Posts'],
    }),
    updatePost: build.mutation<AxiosResponse<Post>, PostUpdateRequest>({
      query: data => ({
        url: `posts/${data.id}/`,
        method: 'PUT',
        data,
      }),
      transformResponse: (response: AxiosResponse<Post>) => {
        response.data = new Post(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Posts', id }],
    }),
    deletePost: build.mutation<AxiosResponse, { id: Post['id'] }>({
      query: data => ({
        url: `posts/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Posts', id }],
    }),
    publishPost: build.mutation<AxiosResponse<void>, { id: Post['id'] }>({
      query: data => ({
        url: `posts/${data.id}/publish/`,
        method: 'POST',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Posts', id }],
    }),
    unpublishPost: build.mutation<AxiosResponse<void>, { id: Post['id'] }>({
      query: data => ({
        url: `posts/${data.id}/unpublish/`,
        method: 'POST',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Posts', id }],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useDeletePostMutation,
  useGetPostQuery,
  useGetPostsListQuery,
  useUpdatePostMutation,
  usePublishPostMutation,
  useUnpublishPostMutation,
} = postsApi;

export default postsApi;
