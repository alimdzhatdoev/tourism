import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import { ChatMessage } from '@app/core/models';
import { API_REDUCERS_ENUM } from '../reducers';
import {
  ChatMessageCRUResponse,
  ListResponse,
} from '@app/core/types/responses';
import {
  ChatMessageCreateRequest,
  ChatMessageDeleteRequest,
  ChatMessageListRequest,
  ChatMessageReadRequest,
  ChatMessageUpdateRequest,
} from '@app/core/types/requests';

export const chatMessagesApi = createApi({
  reducerPath: API_REDUCERS_ENUM.CHAT_MESSAGES,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Chat Messages'],
  endpoints: build => ({
    getChatMessageList: build.query<
      AxiosResponse<ListResponse<ChatMessage>>,
      ChatMessageListRequest
    >({
      query: ({ expand, chat, ...params }) => ({
        url: 'chat_messages/',
        method: 'GET',
        params: { expand: expand?.join(','), chat: chat, ...params },
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<ChatMessage>>,
      ) => {
        response.data.results = response.data.results.map(
          u => new ChatMessage(u),
        );
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Chat Messages', id } as const),
              ),
            ]
          : [{ type: 'Chat Messages', id: 'LIST' }],
    }),
    getChatMessage: build.query<
      AxiosResponse<ChatMessageCRUResponse>,
      ChatMessageReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `chat_messages/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<ChatMessageCRUResponse>) => {
        response.data = new ChatMessage(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Chat Messages', id }],
    }),
    updateChatMessage: build.mutation<
      AxiosResponse<ChatMessageCRUResponse>,
      ChatMessageUpdateRequest
    >({
      query: data => ({
        url: `chat_messages/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          chatMessagesApi.util.updateQueryData(
            'getChatMessage',
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
      transformResponse: (response: AxiosResponse<ChatMessageCRUResponse>) => {
        response.data = new ChatMessage(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Chat Messages', id }],
    }),
    createChatMessage: build.mutation<
      AxiosResponse<ChatMessageCRUResponse>,
      ChatMessageCreateRequest
    >({
      query: data => ({
        url: 'chat_messages/',
        method: 'POST',
        data,
      }),
      transformResponse: (response: AxiosResponse<ChatMessageCRUResponse>) => {
        response.data = new ChatMessage(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Chat Messages', id: 'LIST' }],
    }),

    deleteChatMessage: build.mutation<AxiosResponse, ChatMessageDeleteRequest>({
      query: data => ({
        url: `chat_messages/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Chat Messages', id }],
    }),
  }),
});

export const {
  useGetChatMessageListQuery,
  useLazyGetChatMessageListQuery,
  useGetChatMessageQuery,
  useLazyGetChatMessageQuery,
  useCreateChatMessageMutation,
  useUpdateChatMessageMutation,
} = chatMessagesApi;

export default chatMessagesApi;
