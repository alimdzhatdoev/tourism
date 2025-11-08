import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  AttractionScheduleCreateRequest,
  AttractionScheduleDeleteRequest,
  AttractionScheduleReadRequest,
  AttractionScheduleUpdateRequest,
  ListRequest,
} from '@app/core/types/requests';
import {
  AttractionScheduleCRUResponse,
  ListResponse,
} from '@app/core/types/responses';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import { AttractionSchedule } from '@app/core/models';
import {
  AttractionScheduleExpand,
  AttractionScheduleFilters,
} from '@app/core/models/AttractionSchedule';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/react';

export const attractionsSchedulesApi = createApi({
  reducerPath: API_REDUCERS_ENUM.ATTRACTION_SCHEDULES,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Attraction Schedules'],
  endpoints: build => ({
    getAttractionSchedulesList: build.query<
      AxiosResponse<ListResponse<AttractionSchedule>>,
      ListRequest<AttractionScheduleExpand, Partial<AttractionScheduleFilters>>
    >({
      query: ({ expand, filters, ...params }) => ({
        url: 'attraction_schedules/',
        method: 'GET',
        params: { expand: expand?.join(','), ...filters, ...params },
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<AttractionSchedule>>,
      ) => {
        response.data.results = response.data.results.map(
          u => new AttractionSchedule(u),
        );
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Attraction Schedules', id } as const),
              ),
            ]
          : [{ type: 'Attraction Schedules', id: 'LIST' }],
    }),
    getAttractionSchedule: build.query<
      AxiosResponse<AttractionScheduleCRUResponse>,
      AttractionScheduleReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `attraction_schedules/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<AttractionSchedule>) => {
        response.data = new AttractionSchedule(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Attraction Schedules', id }],
    }),
    createAttractionSchedule: build.mutation<
      AttractionScheduleCRUResponse[],
      AttractionScheduleCreateRequest[]
    >({
      queryFn: async (data, _queryApi, _extraOptions, fetchWithBQ) => {
        const schedulesPromises = await Promise.all(
          data.map(
            async schedule =>
              (await fetchWithBQ({
                url: `attraction_schedules/`,
                method: 'POST',
                data: {
                  ...schedule,
                },
              })) as QueryReturnValue<
                AxiosResponse<AttractionScheduleCRUResponse>,
                FetchBaseQueryError
              >,
          ),
        );

        if (!schedulesPromises.every(u => u.data)) {
          return { error: schedulesPromises.map(u => u.error) };
        }

        return { data: schedulesPromises.map(u => u.data!.data) };
      },
      invalidatesTags: (_, __) => [
        { type: 'Attraction Schedules', id: 'LIST' },
      ],
    }),

    updateAttractionSchedule: build.mutation<
      AttractionScheduleCRUResponse[],
      AttractionScheduleUpdateRequest[]
    >({
      queryFn: async (data, _queryApi, _extraOptions, fetchWithBQ) => {
        const schedulesPromises = await Promise.all(
          data.map(
            async schedule =>
              (await fetchWithBQ({
                url: `attraction_schedules/${schedule.id}/`,
                method: 'PATCH',
                data: {
                  ...schedule,
                },
              })) as QueryReturnValue<
                AxiosResponse<AttractionScheduleCRUResponse>,
                FetchBaseQueryError
              >,
          ),
        );

        if (!schedulesPromises.every(u => u.data)) {
          return { error: schedulesPromises.map(u => u.error) };
        }

        return { data: schedulesPromises.map(u => u.data!.data) };
      },
      invalidatesTags: (_, __) => [
        { type: 'Attraction Schedules', id: 'LIST' },
      ],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteAttractionSchedule: build.mutation<
      AxiosResponse,
      AttractionScheduleDeleteRequest
    >({
      query: data => ({
        url: `attraction_schedules/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Attraction Schedules', id },
      ],
    }),
  }),
});

export const {
  useCreateAttractionScheduleMutation,
  useDeleteAttractionScheduleMutation,
  useGetAttractionScheduleQuery,
  useGetAttractionSchedulesListQuery,
  useLazyGetAttractionScheduleQuery,
  useLazyGetAttractionSchedulesListQuery,
  useUpdateAttractionScheduleMutation,
} = attractionsSchedulesApi;

export default attractionsSchedulesApi;
