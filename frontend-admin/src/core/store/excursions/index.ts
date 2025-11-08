import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@app/core/services/api';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import { ExcursionCRUResponse, ListResponse } from '@app/core/types/responses';
import {
  ExcursionCreateRequest,
  ExcursionDeleteRequest,
  ExcursionReadRequest,
  ExcursionUpdateRequest,
  ListRequest,
} from '@app/core/types/requests';
import { AxiosResponse } from 'axios';
import Excursion, {
  ExcursionExpand,
  ExcursionsFilters,
} from '@app/core/models/Excursion';

export const excursionsApi = createApi({
  reducerPath: API_REDUCERS_ENUM.EXCURSIONS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Excursions'],
  endpoints: build => ({
    getExcursionsList: build.query<
      AxiosResponse<ListResponse<Excursion>>,
      ListRequest<ExcursionExpand, Partial<ExcursionsFilters>>
    >({
      query: ({ expand, filters, ...params }) => ({
        url: 'excursions/',
        method: 'GET',
        params: { expand: expand?.join(','), ...filters, ...params },
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Excursion>>) => {
        response.data.results = response.data.results.map(
          u => new Excursion(u),
        );
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Excursions', id } as const),
              ),
            ]
          : [{ type: 'Excursions', id: 'LIST' }],
    }),
    getExcursion: build.query<
      AxiosResponse<ExcursionCRUResponse>,
      ExcursionReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `excursions/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<ExcursionCRUResponse>) => {
        response.data = new Excursion(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Excursions', id }],
    }),
    createExcursion: build.mutation<
      AxiosResponse<ExcursionCRUResponse>,
      ExcursionCreateRequest
    >({
      query: data => ({
        url: 'excursions/',
        method: 'POST',
        data,
      }),
      transformResponse: (response: AxiosResponse<ExcursionCRUResponse>) => {
        response.data = new Excursion(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Excursions', id: 'LIST' }],
    }),
    updateExcursion: build.mutation<
      AxiosResponse<ExcursionCRUResponse>,
      ExcursionUpdateRequest
    >({
      query: data => ({
        url: `excursions/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          excursionsApi.util.updateQueryData(
            'getExcursion',
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
      transformResponse: (response: AxiosResponse<ExcursionCRUResponse>) => {
        response.data = new Excursion(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Excursions', id }],
    }),
    deleteExcursion: build.mutation<AxiosResponse, ExcursionDeleteRequest>({
      query: data => ({
        url: `excursions/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Excursions', id }],
    }),
  }),
});

export const {
  useGetExcursionsListQuery,
  useLazyGetExcursionsListQuery,
  useGetExcursionQuery,
  useLazyGetExcursionQuery,
  useCreateExcursionMutation,
  useDeleteExcursionMutation,
  useUpdateExcursionMutation,
} = excursionsApi;

export default excursionsApi;
