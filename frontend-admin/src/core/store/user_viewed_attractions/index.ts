import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  ListRequest,
  UserViewedAttractionCreateRequest,
  UserViewedAttractionDeleteRequest,
  UserViewedAttractionReadRequest,
  UserViewedAttractionUpdateRequest,
} from '@app/core/types/requests';
import {
  ListResponse,
  UserViewedAttractionCRUResponse,
} from '@app/core/types/responses';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import AttractionCall, {
  AttractionCallExpand,
} from '@app/core/models/AttractionCall';

export const userViewedAttractionsApi = createApi({
  reducerPath: API_REDUCERS_ENUM.USER_VIEWED_ATTRACTIONS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['ViewedAttractions'],
  endpoints: build => ({
    getUserViewedAttractionsList: build.query<
      AxiosResponse<ListResponse<AttractionCall>>,
      ListRequest<AttractionCallExpand>
    >({
      query: ({ expand, ...params }) => ({
        url: 'user_viewed_attractions/',
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<AttractionCall>>,
      ) => {
        response.data.results = response.data.results.map(
          c => new AttractionCall(c),
        );
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'ViewedAttractions', id } as const),
              ),
            ]
          : [{ type: 'ViewedAttractions', id: 'LIST' }],
    }),
    getUserViewedAttraction: build.query<
      AxiosResponse<UserViewedAttractionCRUResponse>,
      UserViewedAttractionReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `user_viewed_attractions/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (
        response: AxiosResponse<UserViewedAttractionCRUResponse>,
      ) => {
        response.data = new AttractionCall(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'ViewedAttractions', id }],
    }),
    createUserViewedAttraction: build.mutation<
      AxiosResponse<UserViewedAttractionCRUResponse>,
      UserViewedAttractionCreateRequest
    >({
      query: data => ({
        url: 'user_viewed_attractions/',
        method: 'POST',
        data,
      }),
      transformResponse: (
        response: AxiosResponse<UserViewedAttractionCRUResponse>,
      ) => {
        response.data = new AttractionCall(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'ViewedAttractions', id: 'LIST' }],
    }),
    updateUserViewedAttraction: build.mutation<
      AxiosResponse<UserViewedAttractionCRUResponse>,
      UserViewedAttractionUpdateRequest
    >({
      query: data => ({
        url: `user_viewed_attractions/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          userViewedAttractionsApi.util.updateQueryData(
            'getUserViewedAttraction',
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
      transformResponse: (
        response: AxiosResponse<UserViewedAttractionCRUResponse>,
      ) => {
        response.data = new AttractionCall(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'ViewedAttractions', id }],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteUserViewedAttraction: build.mutation<
      AxiosResponse,
      UserViewedAttractionDeleteRequest
    >({
      query: data => ({
        url: `user_viewed_attractions/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'ViewedAttractions', id }],
    }),
  }),
});

export const {
  useGetUserViewedAttractionsListQuery,
  useLazyGetUserViewedAttractionsListQuery,
  useGetUserViewedAttractionQuery,
  useLazyGetUserViewedAttractionQuery,
  useCreateUserViewedAttractionMutation,
  useDeleteUserViewedAttractionMutation,
  useUpdateUserViewedAttractionMutation,
} = userViewedAttractionsApi;

export default userViewedAttractionsApi;
