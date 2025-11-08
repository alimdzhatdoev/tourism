import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import { GroupKindReadRequest, ListRequest } from '@app/core/types/requests';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import { GroupKind } from '@app/core/models';
import { ListResponse } from '@app/core/types/responses';

export const groupKindsApi = createApi({
  reducerPath: API_REDUCERS_ENUM.GROUP_KINDS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Group Kinds'],
  endpoints: build => ({
    getGroupKindsList: build.query<
      AxiosResponse<ListResponse<GroupKind>>,
      ListRequest<void>
    >({
      query: ({ ...params }) => ({
        url: 'group_kinds/',
        method: 'GET',
        params,
      }),
      transformResponse: (response: AxiosResponse<ListResponse<GroupKind>>) => {
        response.data.results = response.data.results.map(
          u => new GroupKind(u),
        );
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Group Kinds', id } as const),
              ),
            ]
          : [{ type: 'Group Kinds', id: 'LIST' }],
    }),
    getGroupKind: build.query<AxiosResponse<GroupKind>, GroupKindReadRequest>({
      query: ({ id, ...params }) => ({
        url: `group_kinds/${id}/`,
        method: 'GET',
        params,
      }),
      transformResponse: (response: AxiosResponse<GroupKind>) => {
        response.data = new GroupKind(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Group Kinds', id }],
    }),
  }),
});

export const {
  useGetGroupKindQuery,
  useGetGroupKindsListQuery,
  useLazyGetGroupKindQuery,
  useLazyGetGroupKindsListQuery,
} = groupKindsApi;

export default groupKindsApi;
