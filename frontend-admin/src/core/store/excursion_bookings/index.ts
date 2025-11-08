import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  ExcursionBookingCreateRequest,
  ExcursionBookingDeleteRequest,
  ExcursionBookingReadRequest,
  ExcursionBookingUpdateRequest,
  ListRequest,
} from '@app/core/types/requests';
import {
  ExcursionBookingCRUResponse,
  ListResponse,
} from '@app/core/types/responses';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import { ExcursionBooking } from '../../models';
import {
  ExcursionBookingExpand,
  ExcursionBookingFilters,
} from '@app/core/models/ExcursionBooking';

export const excursionBookingsApi = createApi({
  reducerPath: API_REDUCERS_ENUM.EXCURSION_BOOKINGS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Excursion Bookings'],
  endpoints: build => ({
    getExcursionBookingsList: build.query<
      AxiosResponse<ListResponse<ExcursionBooking>>,
      ListRequest<ExcursionBookingExpand, Partial<ExcursionBookingFilters>>
    >({
      query: ({ expand, filters, ...params }) => ({
        url: 'excursion_bookings/',
        method: 'GET',
        params: { expand: expand?.join(','), ...filters, ...params },
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<ExcursionBooking>>,
      ) => {
        response.data.results = response.data.results.map(
          u => new ExcursionBooking(u),
        );
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Excursion Bookings', id } as const),
              ),
            ]
          : [{ type: 'Excursion Bookings', id: 'LIST' }],
    }),
    getExcursionBooking: build.query<
      AxiosResponse<ExcursionBookingCRUResponse>,
      ExcursionBookingReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `excursion_bookings/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (
        response: AxiosResponse<ExcursionBookingCRUResponse>,
      ) => {
        response.data = new ExcursionBooking(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Excursion Bookings', id }],
    }),
    createExcursionBooking: build.mutation<
      AxiosResponse<ExcursionBookingCRUResponse>,
      ExcursionBookingCreateRequest
    >({
      query: data => ({
        url: 'excursion_bookings/',
        method: 'POST',
        data,
      }),
      transformResponse: (
        response: AxiosResponse<ExcursionBookingCRUResponse>,
      ) => {
        response.data = new ExcursionBooking(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Excursion Bookings', id: 'LIST' }],
    }),
    updateExcursionBooking: build.mutation<
      AxiosResponse<ExcursionBookingCRUResponse>,
      ExcursionBookingUpdateRequest
    >({
      query: data => ({
        url: `excursion_bookings/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          excursionBookingsApi.util.updateQueryData(
            'getExcursionBooking',
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
        response: AxiosResponse<ExcursionBookingCRUResponse>,
      ) => {
        response.data = new ExcursionBooking(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Excursion Bookings', id }],
    }),
    deleteExcursionBooking: build.mutation<
      AxiosResponse,
      ExcursionBookingDeleteRequest
    >({
      query: data => ({
        url: `excursion_bookings/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Excursion Bookings', id }],
    }),
  }),
});

export const {
  useLazyGetExcursionBookingsListQuery,
  useGetExcursionBookingQuery,
  useLazyGetExcursionBookingQuery,
  useCreateExcursionBookingMutation,
  useUpdateExcursionBookingMutation,
  useDeleteExcursionBookingMutation,
} = excursionBookingsApi;

export default excursionBookingsApi;
