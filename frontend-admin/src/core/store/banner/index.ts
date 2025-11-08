import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  BannerCreateRequest,
  BannerDeleteRequest,
  BannerReadRequest,
  BannerUpdateRequest,
  ListRequest,
} from '@app/core/types/requests';
import { BannersCRUResponse, ListResponse } from '@app/core/types/responses';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import Banner, { BannerExpand, BannersFilters } from '@app/core/models/Banner';

export const bannersApi = createApi({
  reducerPath: API_REDUCERS_ENUM.BANNERS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Banners'],
  endpoints: build => ({
    getBannersList: build.query<
      AxiosResponse<ListResponse<Banner>>,
      ListRequest<BannerExpand, Partial<BannersFilters>>
    >({
      query: ({ expand, filters, ...params }) => ({
        url: 'banners/',
        method: 'GET',
        params: { expand: expand?.join(','), ...filters, ...params },
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Banner>>) => {
        response.data.results = response.data.results.map(u => new Banner(u));
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Banners', id } as const),
              ),
            ]
          : [{ type: 'Banners', id: 'LIST' }],
    }),
    getBanner: build.query<
      AxiosResponse<BannersCRUResponse>,
      BannerReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `banners/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<BannersCRUResponse>) => {
        response.data = new Banner(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Banners', id }],
    }),
    createBanner: build.mutation<
      AxiosResponse<BannersCRUResponse>,
      BannerCreateRequest
    >({
      query: data => ({
        url: 'banners/',
        method: 'POST',
        data,
      }),
      transformResponse: (response: AxiosResponse<BannersCRUResponse>) => {
        response.data = new Banner(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Banners', id: 'LIST' }],
    }),
    updateBanner: build.mutation<
      AxiosResponse<BannersCRUResponse>,
      | BannerUpdateRequest
      | { id: Banner['id']; form: FormData; audio_guid: true }
    >({
      query: data => ({
        url: `banners/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          bannersApi.util.updateQueryData(
            'getBanner',
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
      transformResponse: (response: AxiosResponse<BannersCRUResponse>) => {
        response.data = new Banner(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Banners', id }],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteBanner: build.mutation<AxiosResponse, BannerDeleteRequest>({
      query: data => ({
        url: `banners/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Banners', id }],
    }),
  }),
});

export const {
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useGetBannerQuery,
  useGetBannersListQuery,
  useLazyGetBannerQuery,
  useLazyGetBannersListQuery,
  useUpdateBannerMutation,
} = bannersApi;

export default bannersApi;
