import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@app/core/services/api';
import { ListRequest } from '@app/core/types/requests';
import { ListResponse } from '@app/core/types/responses';
import { API_REDUCERS_ENUM } from '@app/core/store/reducers';
import { AxiosResponse } from 'axios';
import { Category } from '@app/core/models';
import { CategoryExpand } from '@app/core/models/Category';

export const categoriesApi = createApi({
  reducerPath: API_REDUCERS_ENUM.CATEGORIES,
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Categories'],
  endpoints: build => ({
    getCategoriesList: build.query<
      AxiosResponse<ListResponse<Category>>,
      ListRequest<CategoryExpand>
    >({
      query: ({ expand, ...params }) => ({
        url: 'categories/',
        method: 'GET',
        params: { expand: expand?.join(','), ...params },
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Category>>) => {
        response.data.results = response.data.results.map(u => new Category(u));
        return response;
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({ id }) => ({ type: 'Categories', id } as const),
              ),
            ]
          : [{ type: 'Categories', id: 'LIST' }],
    }),
  }),
});

export const { useGetCategoriesListQuery, useLazyGetCategoriesListQuery } =
  categoriesApi;

export default categoriesApi;
