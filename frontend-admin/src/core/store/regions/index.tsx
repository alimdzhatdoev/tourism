import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  ListRequest,
  RegionCreateRequest,
  RegionDeleteRequest,
  RegionUpdateRequest,
} from '@app/core/types/requests';
import { ListResponse, RegionCRUResponse } from '@app/core/types/responses';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import { AxiosResponse, toFormData } from 'axios';
import { Region } from '@app/core/models';
import { RegionExpand } from '@app/core/models/Region';

export const regionsApi = createApi({
  reducerPath: API_REDUCERS_ENUM.REGIONS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Regions'],
  endpoints: build => ({
    getRegionsList: build.query<
      AxiosResponse<ListResponse<Region>>,
      ListRequest<RegionExpand>
    >({
      query: ({ expand, ...params }) => ({
        url: 'regions/',
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Region>>) => {
        response.data.results = response.data.results.map(u => new Region(u));
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Regions', id } as const),
              ),
            ]
          : [{ type: 'Regions', id: 'LIST' }],
    }),
    createRegion: build.mutation<
      AxiosResponse<RegionCRUResponse>,
      RegionCreateRequest
    >({
      query: data => ({
        url: 'regions/',
        method: 'POST',
        data,
      }),
      transformResponse: (response: AxiosResponse<RegionCRUResponse>) => {
        response.data = new Region(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Regions', id: 'LIST' }],
    }),
    deleteRegion: build.mutation<AxiosResponse, RegionDeleteRequest>({
      query: ({ id }) => ({
        url: `regions/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Regions', id }],
    }),
    updateRegion: build.mutation<AxiosResponse<Region>, RegionUpdateRequest>({
      query: ({ id, ...data }) => ({
        url: `regions/${id}/`,
        method: 'PATCH',
        data: toFormData(data, undefined, { indexes: null }),
      }),
      transformResponse: (response: AxiosResponse<Region>) => {
        response.data = new Region(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Regions', id }],
    }),
  }),
});

export const {
  useGetRegionsListQuery,
  useLazyGetRegionsListQuery,
  useCreateRegionMutation,
  useDeleteRegionMutation,
  useUpdateRegionMutation,
} = regionsApi;

export default regionsApi;
