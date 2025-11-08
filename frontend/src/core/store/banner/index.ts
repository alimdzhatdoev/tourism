import {createApi} from '@reduxjs/toolkit/query/react'
import {axiosBaseQuery} from '@core/services'
import {AxiosResponse} from 'axios'
import {Banner, BannerExpand, BannersFilters} from '@core/models/'
import {prepareExpand} from '@/core/utils'
import {ListRequest} from 'types-requests'
import {ListResponse} from 'types-responses'

export const bannersApi = createApi({
  reducerPath: 'banners_api',
  baseQuery: axiosBaseQuery('/banners/'),
  tagTypes: ['Banners'],
  endpoints: build => ({
    getBannersList: build.query<
      AxiosResponse<ListResponse<Banner>>,
      ListRequest<BannerExpand, Partial<BannersFilters>>
    >({
      query: ({expand, filters, ...params}) => ({
        url: '',
        method: 'GET',
        params: {expand: prepareExpand(expand), ...filters, ...params},
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Banner>>) => {
        response.data.results = response.data.results.map(u => new Banner(u))
        return response
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({id}) => ({type: 'Banners', id} as const),
              ),
            ]
          : [{type: 'Banners', id: 'LIST'}],
    }),
  }),
})

export const {useGetBannersListQuery, useLazyGetBannersListQuery} = bannersApi

export default bannersApi
