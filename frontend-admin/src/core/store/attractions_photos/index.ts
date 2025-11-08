import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  AttractionPhotoCreateRequest,
  AttractionPhotoDeleteRequest,
  AttractionPhotoReadRequest,
  AttractionPhotoUpdateRequest,
  ListRequest,
} from '@app/core/types/requests';
import {
  AttractionPhotoCRUResponse,
  ListResponse,
} from '@app/core/types/responses';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import AttractionPhoto, {
  AttractionPhotoExpand,
} from '@app/core/models/AttractionPhoto';

export const attractionsPhotosApi = createApi({
  reducerPath: API_REDUCERS_ENUM.ATTRACTION_PHOTOS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Attraction Photos'],
  endpoints: build => ({
    getAttractionPhotosList: build.query<
      AxiosResponse<ListResponse<AttractionPhoto>>,
      ListRequest<AttractionPhotoExpand>
    >({
      query: ({ expand, ...params }) => ({
        url: 'attraction_photos/',
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<AttractionPhoto>>,
      ) => {
        response.data.results = response.data.results.map(
          u => new AttractionPhoto(u),
        );
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Attraction Photos', id } as const),
              ),
            ]
          : [{ type: 'Attraction Photos', id: 'LIST' }],
    }),
    getAttractionPhoto: build.query<
      AxiosResponse<AttractionPhotoCRUResponse>,
      AttractionPhotoReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `attraction_photos/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (
        response: AxiosResponse<AttractionPhotoCRUResponse>,
      ) => {
        response.data = new AttractionPhoto(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Attraction Photos', id }],
    }),
    createAttractionPhoto: build.mutation<
      AxiosResponse<AttractionPhotoCRUResponse>,
      AttractionPhotoCreateRequest
    >({
      query: data => ({
        url: 'attraction_photos/',
        method: 'POST',
        data,
      }),
      transformResponse: (
        response: AxiosResponse<AttractionPhotoCRUResponse>,
      ) => {
        response.data = new AttractionPhoto(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Attraction Photos', id: 'LIST' }],
    }),
    updateAttractionPhoto: build.mutation<
      AxiosResponse<AttractionPhotoCRUResponse>,
      AttractionPhotoUpdateRequest
    >({
      query: data => ({
        url: `attraction_photos/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          attractionsPhotosApi.util.updateQueryData(
            'getAttractionPhoto',
            { id: requestBody.id },
            draft => {
              Object.assign(draft, requestBody);
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchRes.undo();
        }
      },
      transformResponse: (
        response: AxiosResponse<AttractionPhotoCRUResponse>,
      ) => {
        response.data = new AttractionPhoto(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Attraction Photos', id }],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteAttractionPhoto: build.mutation<
      AxiosResponse,
      AttractionPhotoDeleteRequest
    >({
      query: data => ({
        url: `attraction_photos/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Attraction Photos', id }],
    }),
  }),
});

export const {
  useCreateAttractionPhotoMutation,
  useDeleteAttractionPhotoMutation,
  useGetAttractionPhotoQuery,
  useGetAttractionPhotosListQuery,
  useLazyGetAttractionPhotoQuery,
  useLazyGetAttractionPhotosListQuery,
  useUpdateAttractionPhotoMutation,
} = attractionsPhotosApi;

export default attractionsPhotosApi;
