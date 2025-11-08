import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse, toFormData } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  ListRequest,
  PostSectionCreateRequest,
  PostSectionUpdateRequest,
} from '@app/core/types/requests';
import { ListResponse } from '@app/core/types/responses';
import PostSection from '@app/core/models/PostSection';

export const postSectionsApi = createApi({
  reducerPath: 'post_sections_api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['PostSection'],
  endpoints: build => ({
    getPostSectionsList: build.query<
      AxiosResponse<ListResponse<PostSection>>,
      ListRequest<void>
    >({
      query: params => ({
        url: 'post_sections/',
        method: 'GET',
        params,
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<PostSection>>,
      ) => {
        response.data.results = response.data.results.map(
          u => new PostSection(u),
        );
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'PostSection', id } as const),
              ),
              'PostSection',
            ]
          : ['PostSection'],
    }),
    getPostSection: build.query<
      AxiosResponse<PostSection>,
      { id: PostSection['id'] }
    >({
      query: ({ id, ...params }) => ({
        url: `post_sections/${id}/`,
        method: 'GET',
        params,
      }),
      transformResponse: (response: AxiosResponse<PostSection>) => {
        response.data = new PostSection(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'PostSection', id }],
    }),
    createPostSection: build.mutation<
      AxiosResponse<PostSection>,
      PostSectionCreateRequest
    >({
      query: data => ({
        url: 'post_sections/',
        method: 'POST',
        data: toFormData(data, undefined, { indexes: null }),
      }),
      transformResponse: (response: AxiosResponse<PostSection>) => {
        response.data = new PostSection(response.data);
        return response;
      },
      invalidatesTags: ['PostSection'],
    }),
    updatePostSection: build.mutation<
      AxiosResponse<PostSection>,
      PostSectionUpdateRequest
    >({
      query: data => ({
        url: `post_sections/${data.id}/`,
        method: 'PUT',
        data: toFormData(data, undefined, { indexes: null }),
      }),
      transformResponse: (response: AxiosResponse<PostSection>) => {
        response.data = new PostSection(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'PostSection', id }],
    }),
    deletePostSection: build.mutation<AxiosResponse, { id: PostSection['id'] }>(
      {
        query: data => ({
          url: `post_sections/${data.id}/`,
          method: 'DELETE',
          data,
        }),
        invalidatesTags: (_, __, { id }) => [{ type: 'PostSection', id }],
      },
    ),
  }),
});

export const {
  useCreatePostSectionMutation,
  useDeletePostSectionMutation,
  useGetPostSectionQuery,
  useGetPostSectionsListQuery,
  useUpdatePostSectionMutation,
} = postSectionsApi;

export default postSectionsApi;
