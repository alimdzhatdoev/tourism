import PostSection from '@/core/models/PostSection'
import {axiosBaseQuery} from '@/core/services'
import {createApi} from '@reduxjs/toolkit/query/react'
import {AxiosResponse} from 'axios'
import {ListRequest} from 'types-requests'
import {ListResponse} from 'types-responses'

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
        )
        return response
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({id}) => ({type: 'PostSection', id} as const),
              ),
              'PostSection',
            ]
          : ['PostSection'],
    }),
    getPostSection: build.query<
      AxiosResponse<PostSection>,
      {id: PostSection['id']}
    >({
      query: ({id, ...params}) => ({
        url: `post_sections/${id}/`,
        method: 'GET',
        params,
      }),
      transformResponse: (response: AxiosResponse<PostSection>) => {
        response.data = new PostSection(response.data)
        return response
      },
      providesTags: (_, __, {id}) => [{type: 'PostSection', id}],
    }),
  }),
})

export const {useGetPostSectionQuery, useGetPostSectionsListQuery} =
  postSectionsApi

export default postSectionsApi
