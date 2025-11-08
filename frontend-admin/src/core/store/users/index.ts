import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@app/core/services/api';
import {
  ListRequest,
  TokenRefreshRequest,
  UserReadRequest,
  UserSignInRequest,
  UserSignUpRequest,
  UserUpdateRequest,
  GeocodeLatlngToAddressRequest,
  GeocodeAddressToLatlngRequest,
  UserDeleteRequest,
} from '@app/core/types/requests';
import {
  ListResponse,
  UserCRUResponse,
  UserSignInResponse,
  UserSignUpResponse,
} from '@app/core/types/responses';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import User, { UserExpand } from '@app/core/models/User';
import { AxiosResponse } from 'axios';
import { GeocoderAddress } from '@app/core/models';

export const usersApi = createApi({
  reducerPath: API_REDUCERS_ENUM.USERS,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Users'],
  endpoints: build => ({
    getUsers: build.query<
      AxiosResponse<ListResponse<User>>,
      ListRequest<UserExpand>
    >({
      query: params => ({
        url: 'users/',
        method: 'GET',
        params: { ...params },
      }),
      transformResponse: (response: AxiosResponse<ListResponse<User>>) => {
        response.data.results = response.data.results.map(u => new User(u));
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Users', id } as const),
              ),
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    getUser: build.query<AxiosResponse<UserCRUResponse>, UserReadRequest>({
      query: params => ({
        url: `users/${params.id}/`,
        method: 'GET',
        params: { ...params },
      }),
      providesTags: (_, __, { id }) => [{ type: 'Users', id }],
    }),
    updateUser: build.mutation<
      AxiosResponse<UserCRUResponse>,
      UserUpdateRequest
    >({
      query: data => ({
        url: `users/${data.id}/`,
        method: 'PATCH',
        data,
      }),
      onQueryStarted: async (requestBody, { dispatch, queryFulfilled }) => {
        const patchRes = dispatch(
          usersApi.util.updateQueryData(
            'getUser',
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
      transformResponse: (response: AxiosResponse<UserCRUResponse>) => {
        response.data = new User(response.data);
        return response;
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Users', id }],
    }),
    /**
     * @returns `response.status === 204` on success
     */
    deleteUser: build.mutation<AxiosResponse, UserDeleteRequest>({
      query: data => ({
        url: `users/${data.id}/`,
        method: 'DELETE',
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Users', id }],
    }),
    getMe: build.query<AxiosResponse<UserCRUResponse>, ListRequest<UserExpand>>(
      {
        query: params => ({
          url: 'users/me/',
          method: 'GET',
          params: { ...params },
        }),
        transformResponse: (response: AxiosResponse<UserCRUResponse>) => {
          response.data = new User(response.data);
          return response;
        },
      },
    ),
    signIn: build.mutation<
      AxiosResponse<UserSignInResponse>,
      UserSignInRequest
    >({
      query: data => ({
        url: 'token/obtain/',
        method: 'POST',
        data,
      }),
    }),
    refreshToken: build.mutation<
      AxiosResponse<UserSignInResponse>,
      TokenRefreshRequest
    >({
      query: data => ({
        url: 'token/refresh/',
        method: 'POST',
        data,
      }),
    }),
    signUp: build.mutation<
      AxiosResponse<UserSignUpResponse>,
      UserSignUpRequest
    >({
      query: data => ({
        url: 'register/',
        method: 'POST',
        data,
      }),
    }),
    geocodeLatlngToAddress: build.mutation<
      AxiosResponse<GeocoderAddress>,
      GeocodeLatlngToAddressRequest
    >({
      query: data => ({
        url: 'geocoder/',
        method: 'POST',
        data,
      }),
      transformResponse: (response: AxiosResponse<GeocoderAddress>) => {
        response.data = new GeocoderAddress(response.data);
        return response;
      },
    }),
    geocodeAddressToLatlng: build.mutation<
      AxiosResponse<GeocoderAddress>,
      GeocodeAddressToLatlngRequest
    >({
      query: data => ({
        url: 'geocoder/',
        method: 'POST',
        data,
      }),
      transformResponse: (response: AxiosResponse<GeocoderAddress>) => {
        response.data = new GeocoderAddress(response.data);
        return response;
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useLazyGetUsersQuery,
  useSignInMutation,
  useRefreshTokenMutation,
  useLazyGetMeQuery,
  useGetUserQuery,
  useLazyGetUserQuery,
  useSignUpMutation,
  useGetMeQuery,
  useUpdateUserMutation,
  useGeocodeAddressToLatlngMutation,
  useGeocodeLatlngToAddressMutation,
} = usersApi;

export default usersApi;
