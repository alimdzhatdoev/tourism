import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  AttractionContactCreateRequest,
  AttractionContactDeleteRequest,
  AttractionContactUpdateRequest,
  AttractionReadRequest,
  ListRequest,
} from '@app/core/types/requests';
import {
  AttractionContactCRUResponse,
  ListResponse,
} from '@app/core/types/responses';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import AttractionContact, {
  AttractionContactExpand,
} from '@app/core/models/AttractionContact';

export const attractionsContactsApi = createApi({
  reducerPath: API_REDUCERS_ENUM.ATTRACTION_CONTACTS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Attraction Contacts'],
  endpoints: build => ({
    getAttractionContactsList: build.query<
      AxiosResponse<ListResponse<AttractionContact>>,
      ListRequest<AttractionContactExpand>
    >({
      query: ({ expand, ...params }) => ({
        url: 'attraction_contacts/',
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<AttractionContact>>,
      ) => {
        response.data.results = response.data.results.map(
          u => new AttractionContact(u),
        );
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Attraction Contacts', id } as const),
              ),
              'Attraction Contacts',
            ]
          : ['Attraction Contacts'],
    }),
    getAttractionContact: build.query<
      AttractionContactCRUResponse,
      AttractionReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `attraction_contacts/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      providesTags: (_, __, { id }) => [{ type: 'Attraction Contacts', id }],
    }),
    createAttractionContact: build.mutation<
      AxiosResponse<AttractionContact>,
      AttractionContactCreateRequest
    >({
      query: data => ({
        url: 'attraction_contacts/',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Attraction Contacts'],
    }),
    updateAttractionContact: build.mutation<
      AxiosResponse<AttractionContact>,
      AttractionContactUpdateRequest
    >({
      query: ({ id, ...data }) => ({
        url: `attraction_contacts/${id}/`,
        method: 'POST',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Attraction Contacts', id }],
    }),
    deleteAttractionContact: build.mutation<
      AxiosResponse,
      AttractionContactDeleteRequest
    >({
      query: ({ id }) => ({
        url: `attraction_contacts/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Attraction Contacts', id }],
    }),
  }),
});

export const {
  useCreateAttractionContactMutation,
  useDeleteAttractionContactMutation,
  useGetAttractionContactQuery,
  useGetAttractionContactsListQuery,
  useUpdateAttractionContactMutation,
  useLazyGetAttractionContactQuery,
  useLazyGetAttractionContactsListQuery,
} = attractionsContactsApi;

export default attractionsContactsApi;
