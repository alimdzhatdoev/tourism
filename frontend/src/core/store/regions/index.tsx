import {Region} from '@/core/models'
import {RegionExpand} from '@/core/models/Region'
import {axiosBaseQuery} from '@/core/services'
import {createApi} from '@reduxjs/toolkit/query/react'
import {AxiosResponse} from 'axios'
import {ListRequest} from 'types-requests'
import {ListResponse} from 'types-responses'

export const regionsApi = createApi({
  reducerPath: 'regions_api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Regions'],
  endpoints: build => ({
    getRegionsList: build.query<
      AxiosResponse<ListResponse<Region>>,
      ListRequest<RegionExpand>
    >({
      query: params => ({
        url: '/regions/',
        method: 'GET',
        params,
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Region>>) => {
        response.data.results = response.data.results.map(u => new Region(u))
        return response
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({id}) => ({type: 'Regions', id} as const),
              ),
            ]
          : [{type: 'Regions', id: 'LIST'}],
    }),
  }),
})

export const {useGetRegionsListQuery} = regionsApi

export default regionsApi
