import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  CityCreateRequest,
  CityDeleteRequest,
  CityUpdateRequest,
  ListRequest,
} from '@app/core/types/requests';
import { CityCRUResponse, ListResponse } from '@app/core/types/responses';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import { AxiosResponse, toFormData } from 'axios';
import { City } from '@app/core/models';
import { CityExpand } from '@app/core/models/City';

export const citiesApi = createApi({
  reducerPath: API_REDUCERS_ENUM.CITIES,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Cities'],
  endpoints: build => ({
    getCitiesList: build.query<
      AxiosResponse<ListResponse<City>>,
      ListRequest<CityExpand>
    >({
      query: ({ expand, ...params }) => ({
        url: 'cities/',
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<ListResponse<City>>) => {
        response.data.results = response.data.results.map(u => new City(u));
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Cities', id } as const),
              ),
            ]
          : [{ type: 'Cities', id: 'LIST' }],
    }),
    createCity: build.mutation<
      AxiosResponse<CityCRUResponse>,
      CityCreateRequest
    >({
      query: data => ({
        url: 'cities/',
        method: 'POST',
        data,
      }),
      transformResponse: (response: AxiosResponse<CityCRUResponse>) => {
        response.data = new City(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Cities', id: 'LIST' }],
    }),
    deleteCity: build.mutation<AxiosResponse, CityDeleteRequest>({
      query: ({ id }) => ({
        url: `cities/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Cities', id }],
    }),
    updateCity: build.mutation<AxiosResponse<City>, CityUpdateRequest>({
      query: ({ id, ...data }) => ({
        url: `cities/${id}/`,
        method: 'PATCH',
        data: toFormData(data, undefined, { indexes: null }),
      }),
      transformResponse: (response: AxiosResponse<City>) => {
        response.data = new City(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Cities', id }],
    }),
  }),
});

export const {
  useGetCitiesListQuery,
  useLazyGetCitiesListQuery,
  useCreateCityMutation,
  useDeleteCityMutation,
  useUpdateCityMutation,
} = citiesApi;

export default citiesApi;
