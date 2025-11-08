import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { Contact } from '../../models';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  ContactCreateRequest,
  ContactUpdateRequest,
} from '@app/core/types/requests';

export const contactsApi = createApi({
  reducerPath: 'contacts_api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Contacts'],
  endpoints: build => ({
    createContact: build.mutation<AxiosResponse<Contact>, ContactCreateRequest>(
      {
        query: data => ({
          url: 'contacts/',
          method: 'POST',
          data,
        }),
        invalidatesTags: [{ type: 'Contacts', id: 'LIST' }],
      },
    ),
    updateContact: build.mutation<AxiosResponse<Contact>, ContactUpdateRequest>(
      {
        query: ({ id, ...data }) => ({
          url: `contacts/${id}/`,
          method: 'POST',
          data,
        }),
        invalidatesTags: (_, __, { id }) => [{ type: 'Contacts', id }],
      },
    ),
    deleteContact: build.mutation<
      AxiosResponse<Contact>,
      { id: Contact['id'] }
    >({
      query: ({ id }) => ({
        url: `contacts/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Contacts', id }],
    }),
  }),
});

export const {
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = contactsApi;
