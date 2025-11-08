import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  ListRequest,
  UserCalledAttractionCreateRequest,
  UserCalledAttractionDeleteRequest,
  UserCalledAttractionReadRequest,
  UserCalledAttractionUpdateRequest,
} from '@app/core/types/requests';
import {
  ListResponse,
  UserCalledAttractionCRUResponse,
} from '@app/core/types/responses';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import AttractionCall, {
  AttractionCallExpand,
} from '@app/core/models/AttractionCall';

export const userCalledAttractionsApi = createApi({
  reducerPath: API_REDUCERS_ENUM.USER_CALLED_ATTRACTIONS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['CalledAttractions'],
  endpoints: build => ({
    getUserCalledAttractionsList: build.query<
      AxiosResponse<ListResponse<AttractionCall>>,
      ListRequest<AttractionCallExpand>
    >({
      query: ({ expand, ...params }) => ({
        url: 'user_called_attractions/',
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
                ({ id }) => ({ type: 'CalledAttractions', id } as const),
              ),
            ]
          : [{ type: 'CalledAttractions', id: 'LIST' }],
    }),
    getUserCalledAttraction: build.query<
      AxiosResponse<UserCalledAttractionCRUResponse>,
      UserCalledAttractionReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `user_called_attractions/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (
        response: AxiosResponse<UserCalledAttractionCRUResponse>,
      ) => {
        response.data = new AttractionCall(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'CalledAttractions', id }],
    }),
    createUserCalledAttraction: build.mutation<
      AxiosResponse<UserCalledAttractionCRUResponse>,
      UserCalledAttractionCreateRequest
    >({
      query: data => ({
        url: 'user_called_attractions/',
        method: 'POST',
        data,
      }),
      transformResponse: (
        response: AxiosResponse<UserCalledAttractionCRUResponse>,
      ) => {
        response.data = new AttractionCall(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'CalledAttractions', id: 'LIST' }],
    }),
    updateUserCalledAttraction: build.mutation<
      AxiosResponse<UserCalledAttractionCRUResponse>,
      UserCalledAttractionUpdateRequest
    >({
      query: data => ({
        url: `user_called_attractions/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          userCalledAttractionsApi.util.updateQueryData(
            'getUserCalledAttraction',
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
        response: AxiosResponse<UserCalledAttractionCRUResponse>,
      ) => {
        response.data = new AttractionCall(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'CalledAttractions', id }],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteUserCalledAttraction: build.mutation<
      AxiosResponse,
      UserCalledAttractionDeleteRequest
    >({
      query: data => ({
        url: `user_called_attractions/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'CalledAttractions', id }],
    }),
  }),
});

export const {
  useGetUserCalledAttractionsListQuery,
  useLazyGetUserCalledAttractionsListQuery,
  useGetUserCalledAttractionQuery,
  useLazyGetUserCalledAttractionQuery,
  useCreateUserCalledAttractionMutation,
  useDeleteUserCalledAttractionMutation,
  useUpdateUserCalledAttractionMutation,
} = userCalledAttractionsApi;

export default userCalledAttractionsApi;
