import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@app/core/services/api';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import {
  ExcursionTimeCRUResponse,
  ListResponse,
} from '@app/core/types/responses';
import { ExcursionTime } from '@app/core/models/';
import {
  ExcursionTimeCreateRequest,
  ExcursionTimeDeleteRequest,
  ExcursionTimeReadRequest,
  ExcursionTimeUpdateRequest,
  ListRequest,
} from '@app/core/types/requests';
import { AxiosResponse } from 'axios';
import { ExcursionTimeExpand } from '../../models/ExcursionTime';

export const excursionTimesApi = createApi({
  reducerPath: API_REDUCERS_ENUM.EXCURSION_TIMES,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Excursion Times'],
  endpoints: build => ({
    getExcursionTimesList: build.query<
      AxiosResponse<ListResponse<ExcursionTime>>,
      ListRequest<ExcursionTimeExpand, never>
    >({
      query: params => ({
        url: 'excursion_times/',
        method: 'GET',
        params: { ...params },
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<ExcursionTime>>,
      ) => {
        response.data.results = response.data.results.map(
          u => new ExcursionTime(u),
        );
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Excursion Times', id } as const),
              ),
            ]
          : [{ type: 'Excursion Times', id: 'LIST' }],
    }),
    getExcursionTime: build.query<
      AxiosResponse<ExcursionTimeCRUResponse>,
      ExcursionTimeReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `excursion_times/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (
        response: AxiosResponse<ExcursionTimeCRUResponse>,
      ) => {
        response.data = new ExcursionTime(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Excursion Times', id }],
    }),
    createExcursionTime: build.mutation<
      AxiosResponse<ExcursionTimeCRUResponse>,
      ExcursionTimeCreateRequest
    >({
      query: data => ({
        url: 'excursion_times/',
        method: 'POST',
        data,
      }),
      transformResponse: (
        response: AxiosResponse<ExcursionTimeCRUResponse>,
      ) => {
        response.data = new ExcursionTime(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Excursion Times', id: 'LIST' }],
    }),
    updateExcursionTime: build.mutation<
      AxiosResponse<ExcursionTimeCRUResponse>,
      ExcursionTimeUpdateRequest
    >({
      query: data => ({
        url: `excursion_times/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          excursionTimesApi.util.updateQueryData(
            'getExcursionTime',
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
        response: AxiosResponse<ExcursionTimeCRUResponse>,
      ) => {
        response.data = new ExcursionTime(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Excursion Times', id }],
    }),
    deleteExcursionTime: build.mutation<
      AxiosResponse,
      ExcursionTimeDeleteRequest
    >({
      query: data => ({
        url: `excursion_times/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Excursion Times', id }],
    }),
  }),
});

export const {
  useGetExcursionTimesListQuery,
  useLazyGetExcursionTimesListQuery,
  useCreateExcursionTimeMutation,
  useDeleteExcursionTimeMutation,
  useGetExcursionTimeQuery,
  useLazyGetExcursionTimeQuery,
  useUpdateExcursionTimeMutation,
} = excursionTimesApi;

export default excursionTimesApi;
