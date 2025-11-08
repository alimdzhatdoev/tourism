import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse, toFormData } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  GroupCreateRequest,
  GroupDeleteRequest,
  GroupReadRequest,
  GroupUpdateRequest,
  ListRequest,
} from '@app/core/types/requests';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import { Group } from '@app/core/models';
import { ListResponse } from '@app/core/types/responses';
import { GroupExpand } from '@app/core/models/Group';

export const groupsApi = createApi({
  reducerPath: API_REDUCERS_ENUM.GROUPS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Groups'],
  endpoints: build => ({
    getGroupsList: build.query<
      AxiosResponse<ListResponse<Group>>,
      ListRequest<GroupExpand>
    >({
      query: ({ expand, ...params }) => ({
        url: 'groups/',
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Group>>) => {
        response.data.results = response.data.results.map(u => new Group(u));
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Groups', id } as const),
              ),
            ]
          : [{ type: 'Groups', id: 'LIST' }],
    }),
    getGroup: build.query<AxiosResponse<Group>, GroupReadRequest>({
      query: ({ id, expand, ...params }) => ({
        url: `groups/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<Group>) => {
        response.data = new Group(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Groups', id }],
    }),
    createGroup: build.mutation<AxiosResponse<Group>, GroupCreateRequest>({
      query: data => ({
        url: 'groups/',
        method: 'POST',
        data: toFormData(data, undefined, { indexes: null }),
      }),
      transformResponse: (response: AxiosResponse<Group>) => {
        response.data = new Group(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Groups', id: 'LIST' }],
    }),
    updateGroup: build.mutation<AxiosResponse<Group>, GroupUpdateRequest>({
      query: data => ({
        url: `groups/${data.id}/`,
        method: 'PATCH',
        data: toFormData(data, undefined, { indexes: null }),
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          groupsApi.util.updateQueryData(
            'getGroup',
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
      transformResponse: (response: AxiosResponse<Group>) => {
        response.data = new Group(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Groups', id }],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteGroup: build.mutation<AxiosResponse, GroupDeleteRequest>({
      query: data => ({
        url: `groups/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Groups', id }],
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useGetGroupQuery,
  useGetGroupsListQuery,
  useLazyGetGroupQuery,
  useLazyGetGroupsListQuery,
  useUpdateGroupMutation,
} = groupsApi;

export default groupsApi;
