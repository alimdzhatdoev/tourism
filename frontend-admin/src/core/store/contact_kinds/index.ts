import ContactKind from '@app/core/models/ContactKind';
import { axiosBaseQuery } from '@app/core/services/api';
import { ListRequest } from '@app/core/types/requests';
import { ListResponse } from '@app/core/types/responses';
import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';

export const contactKindsApi = createApi({
  reducerPath: 'contact_kinds_api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['ContactKinds'],
  endpoints: build => ({
    getContackKindsList: build.query<
      AxiosResponse<ListResponse<ContactKind>>,
      ListRequest<void>
    >({
      query: params => ({
        url: 'contact_kinds/',
        method: 'GET',
        params,
      }),
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'ContactKinds', id } as const),
              ),
            ]
          : [{ type: 'ContactKinds', id: 'LIST' }],
    }),
  }),
});

export const { useGetContackKindsListQuery, useLazyGetContackKindsListQuery } =
  contactKindsApi;
