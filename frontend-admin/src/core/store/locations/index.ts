import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  ListRequest,
  LocationCreateRequest,
  LocationDeleteRequest,
  LocationReadRequest,
  LocationUpdateRequest,
} from '@app/core/types/requests';
import { ListResponse, LocationCRUResponse } from '@app/core/types/responses';
import Location, { LocationExpand } from '@app/core/models/Location';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import { AxiosResponse } from 'axios';
import { AttractionsFilters } from '@app/core/models/Attraction';

export const locationsApi = createApi({
  reducerPath: API_REDUCERS_ENUM.LOCATIONS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Locations'],
  endpoints: build => ({
    getLocationsList: build.query<
      AxiosResponse<ListResponse<Location>>,
      ListRequest<LocationExpand, Partial<AttractionsFilters>>
    >({
      query: ({ expand, filters, ...params }) => ({
        url: 'locations/',
        method: 'GET',
        params: { expand: expand?.join(','), ...filters, ...params },
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Location>>) => {
        response.data.results = response.data.results.map(u => new Location(u));
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Locations', id } as const),
              ),
            ]
          : [{ type: 'Locations', id: 'LIST' }],
    }),
    getLocation: build.query<
      AxiosResponse<LocationCRUResponse>,
      LocationReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `locations/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<LocationCRUResponse>) => {
        response.data = new Location(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Locations', id }],
    }),
    createLocation: build.mutation<
      AxiosResponse<LocationCRUResponse>,
      LocationCreateRequest
    >({
      query: data => ({
        url: 'locations/',
        method: 'POST',
        data,
      }),
      transformResponse: (response: AxiosResponse<LocationCRUResponse>) => {
        response.data = new Location(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Locations', id: 'LIST' }],
    }),
    updateLocation: build.mutation<
      AxiosResponse<LocationCRUResponse>,
      LocationUpdateRequest
    >({
      query: data => ({
        url: `locations/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          locationsApi.util.updateQueryData(
            'getLocation',
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
      transformResponse: (response: AxiosResponse<LocationCRUResponse>) => {
        response.data = new Location(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Locations', id }],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteLocation: build.mutation<AxiosResponse, LocationDeleteRequest>({
      query: data => ({
        url: `locations/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Locations', id }],
    }),
  }),
});

export const {
  useGetLocationsListQuery,
  useLazyGetLocationsListQuery,
  useGetLocationQuery,
  useLazyGetLocationQuery,
  useCreateLocationMutation,
  useDeleteLocationMutation,
  useUpdateLocationMutation,
} = locationsApi;

export default locationsApi;
