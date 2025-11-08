import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosResponse } from 'axios';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  ListRequest,
  UserFavAttractionCreateRequest,
  UserFavAttractionDeleteRequest,
  UserFavAttractionReadRequest,
  UserFavAttractionUpdateRequest,
} from '@app/core/types/requests';
import {
  ListResponse,
  UserFavAttractionCRUResponse,
} from '@app/core/types/responses';
import UserFavouriteAttraction, {
  UserFavAttractionExpand,
} from '@app/core/models/UserFavouriteAttraction';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';

export const userFavouritesApi = createApi({
  reducerPath: API_REDUCERS_ENUM.USER_FAVOURITE_ATTRACTIONS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Favourites'],
  endpoints: build => ({
    getUserFavAttractionsList: build.query<
      AxiosResponse<ListResponse<UserFavouriteAttraction>>,
      ListRequest<UserFavAttractionExpand>
    >({
      query: ({ expand, ...params }) => ({
        url: 'user_favourite_attractions/',
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<UserFavouriteAttraction>>,
      ) => {
        response.data.results = response.data.results.map(
          u => new UserFavouriteAttraction(u),
        );
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Favourites', id } as const),
              ),
            ]
          : [{ type: 'Favourites', id: 'LIST' }],
    }),
    getUserFavAttraction: build.query<
      AxiosResponse<UserFavAttractionCRUResponse>,
      UserFavAttractionReadRequest
    >({
      query: ({ id, expand, ...params }) => ({
        url: `user_favourite_attractions/${id}/`,
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (
        response: AxiosResponse<UserFavAttractionCRUResponse>,
      ) => {
        response.data = new UserFavouriteAttraction(response.data);
        return response;
      },
      providesTags: (_, __, { id }) => [{ type: 'Favourites', id }],
    }),
    createUserFavAttraction: build.mutation<
      AxiosResponse<UserFavAttractionCRUResponse>,
      UserFavAttractionCreateRequest
    >({
      query: data => ({
        url: 'user_favourite_attractions/',
        method: 'POST',
        data,
      }),
      transformResponse: (
        response: AxiosResponse<UserFavAttractionCRUResponse>,
      ) => {
        response.data = new UserFavouriteAttraction(response.data);
        return response;
      },
      invalidatesTags: [{ type: 'Favourites', id: 'LIST' }],
    }),
    updateUserFavAttraction: build.mutation<
      AxiosResponse<UserFavAttractionCRUResponse>,
      UserFavAttractionUpdateRequest
    >({
      query: data => ({
        url: `user_favourite_attractions/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          userFavouritesApi.util.updateQueryData(
            'getUserFavAttraction',
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
        response: AxiosResponse<UserFavAttractionCRUResponse>,
      ) => {
        response.data = new UserFavouriteAttraction(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Favourites', id }],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteUserFavAttraction: build.mutation<
      AxiosResponse,
      UserFavAttractionDeleteRequest
    >({
      query: data => ({
        url: `user_favourite_attractions/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Favourites', id }],
    }),
  }),
});

export const {
  useGetUserFavAttractionsListQuery,
  useLazyGetUserFavAttractionsListQuery,
  useGetUserFavAttractionQuery,
  useLazyGetUserFavAttractionQuery,
  useCreateUserFavAttractionMutation,
  useDeleteUserFavAttractionMutation,
  useUpdateUserFavAttractionMutation,
} = userFavouritesApi;

export default userFavouritesApi;
