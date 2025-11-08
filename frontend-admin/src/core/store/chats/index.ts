import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  ChatReadRequest,
  ChatUpdateRequest,
  ListRequest,
} from '@app/core/types/requests';
import { ChatCRUResponse, ListResponse } from '@app/core/types/responses';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import { AxiosResponse } from 'axios';
import { Chat } from '@app/core/models';
import { ChatExpand } from '@app/core/models/Chat';

export const chatsApi = createApi({
  reducerPath: API_REDUCERS_ENUM.CHATS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Chats'],
  endpoints: build => ({
    getChatsList: build.query<
      AxiosResponse<ListResponse<Chat>>,
      ListRequest<ChatExpand>
    >({
      query: ({ expand, ...params }) => ({
        url: 'chats/',
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Chat>>) => {
        response.data.results = response.data.results.map(u => new Chat(u));
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Chats', id } as const),
              ),
            ]
          : [{ type: 'Chats', id: 'LIST' }],
    }),
    getChat: build.query<AxiosResponse<ChatCRUResponse>, ChatReadRequest>({
      query: ({ id, expand, ...params }) => ({
        url: `chats/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<ChatCRUResponse>) => {
        response.data = new Chat(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Chats', id }],
    }),
    updateChat: build.mutation<
      AxiosResponse<ChatCRUResponse>,
      ChatUpdateRequest
    >({
      query: data => ({
        url: `chats/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          chatsApi.util.updateQueryData(
            'getChat',
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
      transformResponse: (response: AxiosResponse<ChatCRUResponse>) => {
        response.data = new Chat(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Chats', id }],
    }),
  }),
});

export const {
  useGetChatsListQuery,
  useLazyGetChatsListQuery,
  useUpdateChatMutation,
} = chatsApi;

export default chatsApi;
