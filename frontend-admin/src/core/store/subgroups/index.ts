import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse, toFormData } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  ListRequest,
  SubgroupCreateRequest,
  SubgroupDeleteRequest,
  SubgroupReadRequest,
  SubgroupUpdateRequest,
} from '@app/core/types/requests';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import { Subgroup } from '@app/core/models';
import { ListResponse } from '@app/core/types/responses';
import { SubgroupsExpand } from '@app/core/models/Subgroup';

export const subgroupsApi = createApi({
  reducerPath: API_REDUCERS_ENUM.SUBGROUPS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Subgroups'],
  endpoints: build => ({
    getSubgroupsList: build.query<
      AxiosResponse<ListResponse<Subgroup>>,
      ListRequest<SubgroupsExpand>
    >({
      query: ({ ...params }) => ({
        url: 'subgroups/',
        method: 'GET',
        params,
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Subgroup>>) => {
        response.data.results = response.data.results.map(u => new Subgroup(u));
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Subgroups', id } as const),
              ),
            ]
          : [{ type: 'Subgroups', id: 'LIST' }],
    }),
    getSubgroup: build.query<AxiosResponse<Subgroup>, SubgroupReadRequest>({
      query: ({ id, ...params }) => ({
        url: `subgroups/${id}/`,
        method: 'GET',
        params,
      }),
      transformResponse: (response: AxiosResponse<Subgroup>) => {
        response.data = new Subgroup(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Subgroups', id }],
    }),
    createSubgroup: build.mutation<
      AxiosResponse<Subgroup>,
      SubgroupCreateRequest
    >({
      query: data => ({
        url: 'subgroups/',
        method: 'POST',
        data: toFormData(data, undefined, { indexes: null }),
      }),
      transformResponse: (response: AxiosResponse<Subgroup>) => {
        response.data = new Subgroup(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Subgroups', id: 'LIST' }],
    }),
    updateSubgroup: build.mutation<
      AxiosResponse<Subgroup>,
      SubgroupUpdateRequest
    >({
      query: data => ({
        url: `subgroups/${data.id}/`,
        method: 'PATCH',
        data: toFormData(data, undefined, { indexes: null }),
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          subgroupsApi.util.updateQueryData(
            'getSubgroup',
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
      transformResponse: (response: AxiosResponse<Subgroup>) => {
        response.data = new Subgroup(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Subgroups', id }],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteSubgroup: build.mutation<AxiosResponse, SubgroupDeleteRequest>({
      query: data => ({
        url: `subgroups/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Subgroups', id }],
    }),
  }),
});

export const {
  useCreateSubgroupMutation,
  useDeleteSubgroupMutation,
  useGetSubgroupQuery,
  useGetSubgroupsListQuery,
  useLazyGetSubgroupQuery,
  useLazyGetSubgroupsListQuery,
  useUpdateSubgroupMutation,
} = subgroupsApi;

export default subgroupsApi;
