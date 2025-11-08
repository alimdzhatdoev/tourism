import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  AttractionCreateRequest,
  AttractionDeleteRequest,
  AttractionReadRequest,
  AttractionUpdateRequest,
  ListRequest,
} from '@app/core/types/requests';
import { AttractionCRUResponse, ListResponse } from '@app/core/types/responses';
import Attraction, {
  AttractionExpand,
  AttractionsFilters,
} from '@app/core/models/Attraction';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';

export const attractionsApi = createApi({
  reducerPath: API_REDUCERS_ENUM.ATTRACTIONS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Attractions'],
  endpoints: build => ({
    getAttractionsList: build.query<
      AxiosResponse<ListResponse<Attraction>>,
      ListRequest<AttractionExpand, Partial<AttractionsFilters>>
    >({
      query: ({ expand, filters, ...params }) => ({
        url: 'attractions/',
        method: 'GET',
        params: { expand: expand?.join(','), ...filters, ...params },
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<Attraction>>,
      ) => {
        response.data.results = response.data.results.map(
          u => new Attraction(u),
        );
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Attractions', id } as const),
              ),
            ]
          : [{ type: 'Attractions', id: 'LIST' }],
    }),
    getAttraction: build.query<
      AxiosResponse<AttractionCRUResponse>,
      AttractionReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `attractions/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<AttractionCRUResponse>) => {
        response.data = new Attraction(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Attractions', id }],
    }),
    createAttraction: build.mutation<
      AxiosResponse<AttractionCRUResponse>,
      AttractionCreateRequest
    >({
      query: data => ({
        url: 'attractions/',
        method: 'POST',
        data,
      }),
      transformResponse: (response: AxiosResponse<AttractionCRUResponse>) => {
        response.data = new Attraction(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Attractions', id: 'LIST' }],
    }),
    updateAttraction: build.mutation<
      AxiosResponse<AttractionCRUResponse>,
      | AttractionUpdateRequest
      | { id: Attraction['id']; form: FormData; audio_guid: true }
    >({
      query: data => ({
        url: `attractions/${data.id}/`,
        method: 'PATCH',
        data: data.audio_guid === true ? data.form : data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          attractionsApi.util.updateQueryData(
            'getAttraction',
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
      transformResponse: (response: AxiosResponse<AttractionCRUResponse>) => {
        response.data = new Attraction(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Attractions', id }],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteAttraction: build.mutation<AxiosResponse, AttractionDeleteRequest>({
      query: data => ({
        url: `attractions/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Attractions', id }],
    }),
  }),
});

export const {
  useGetAttractionsListQuery,
  useLazyGetAttractionsListQuery,
  useGetAttractionQuery,
  useLazyGetAttractionQuery,
  useCreateAttractionMutation,
  useDeleteAttractionMutation,
  useUpdateAttractionMutation,
} = attractionsApi;

export default attractionsApi;
