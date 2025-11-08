import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@app/core/services/api';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import {
  ExcursionDateCRUResponse,
  ListResponse,
} from '@app/core/types/responses';
import { ExcursionDate } from '@app/core/models/';
import {
  ExcursionDateCreateRequest,
  ExcursionDateDeleteRequest,
  ExcursionDateReadRequest,
  ExcursionDateUpdateRequest,
  ListRequest,
} from '@app/core/types/requests';
import { AxiosResponse } from 'axios';
import { ExcursionDateExpand } from '../../models/ExcursionDate';

export const excursionDatesApi = createApi({
  reducerPath: API_REDUCERS_ENUM.EXCURSION_DATES,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Excursion Dates'],
  endpoints: build => ({
    getExcursionDatesList: build.query<
      AxiosResponse<ListResponse<ExcursionDate>>,
      ListRequest<ExcursionDateExpand, never>
    >({
      query: params => ({
        url: 'excursion_dates/',
        method: 'GET',
        params: { ...params },
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<ExcursionDate>>,
      ) => {
        response.data.results = response.data.results.map(
          u => new ExcursionDate(u),
        );
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Excursion Dates', id } as const),
              ),
            ]
          : [{ type: 'Excursion Dates', id: 'LIST' }],
    }),
    getExcursionDate: build.query<
      AxiosResponse<ExcursionDateCRUResponse>,
      ExcursionDateReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `excursion_dates/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (
        response: AxiosResponse<ExcursionDateCRUResponse>,
      ) => {
        response.data = new ExcursionDate(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Excursion Dates', id }],
    }),
    createExcursionDate: build.mutation<
      AxiosResponse<ExcursionDateCRUResponse>,
      ExcursionDateCreateRequest
    >({
      query: data => ({
        url: 'excursion_dates/',
        method: 'POST',
        data,
      }),
      transformResponse: (
        response: AxiosResponse<ExcursionDateCRUResponse>,
      ) => {
        response.data = new ExcursionDate(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Excursion Dates', id: 'LIST' }],
    }),
    updateExcursionDate: build.mutation<
      AxiosResponse<ExcursionDateCRUResponse>,
      ExcursionDateUpdateRequest
    >({
      query: data => ({
        url: `excursion_dates/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          excursionDatesApi.util.updateQueryData(
            'getExcursionDate',
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
        response: AxiosResponse<ExcursionDateCRUResponse>,
      ) => {
        response.data = new ExcursionDate(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Excursion Dates', id }],
    }),
    deleteExcursionDate: build.mutation<
      AxiosResponse,
      ExcursionDateDeleteRequest
    >({
      query: data => ({
        url: `excursion_dates/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Excursion Dates', id }],
    }),
  }),
});

export const {
  useGetExcursionDatesListQuery,
  useLazyGetExcursionDatesListQuery,
  useGetExcursionDateQuery,
  useLazyGetExcursionDateQuery,
  useCreateExcursionDateMutation,
  useDeleteExcursionDateMutation,
} = excursionDatesApi;

export default excursionDatesApi;
