import {Route} from '@/core/models'
import {RouteExpand, RouteFilters} from '@/core/models/Route'
import {axiosBaseQuery} from '@/core/services'
import {prepareExpand} from '@/core/utils'
import {PatchCollection} from '@reduxjs/toolkit/dist/query/core/buildThunks'
import {createApi} from '@reduxjs/toolkit/query/react'
import {AxiosResponse} from 'axios'
import {ListRequest, ReadRequest} from 'types-requests'
import {ListResponse} from 'types-responses'

export const routesApi = createApi({
  reducerPath: 'routes_api',
  baseQuery: axiosBaseQuery('/routes/'),
  tagTypes: ['Routes'],
  endpoints: build => ({
    getRoutesList: build.query<
      AxiosResponse<ListResponse<Route>>,
      ListRequest<RouteExpand, Partial<RouteFilters>>
    >({
      query: ({expand, filters, ...params}) => ({
        url: '',
        method: 'GET',
        params: {
          expand: prepareExpand(expand),
          status: 'PUBLICATION',
          ...filters,
          ...params,
        },
      }),
      transformResponse: (response: AxiosResponse<ListResponse<Route>>) => {
        response.data.results = response.data.results.map(u => new Route(u))
        return response
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(({id}) => ({
                type: 'Routes' as const,
                id,
              })),
              'Routes',
            ]
          : ['Routes'],
    }),
    getRoute: build.query<AxiosResponse<Route>, ReadRequest<RouteExpand>>({
      query: ({id, expand, ...params}) => ({
        url: `${id}/`,
        method: 'GET',
        params: {expand: prepareExpand(expand), ...params},
      }),
      transformResponse: (response: AxiosResponse<Route>) => {
        response.data = new Route(response.data)
        return response
      },
      providesTags: (_, __, {id}) => [{type: 'Routes', id}],
    }),
    createRouteLike: build.mutation<AxiosResponse<void>, ReadRequest>({
      query: ({id, expand, ...params}) => ({
        url: `${id}/like/`,
        method: 'POST',
        params: {expand: prepareExpand(expand), ...params},
      }),
      async onQueryStarted({id}, {dispatch, queryFulfilled, getState}) {
        const patches: Array<PatchCollection> = []

        routesApi.util
          .selectInvalidatedBy(getState() as any, [{type: 'Routes', id}])
          .some(({endpointName, originalArgs}) => {
            if (endpointName === 'getRoutesList') {
              const patchAction = routesApi.util.updateQueryData(
                endpointName,
                originalArgs,
                draft => {
                  const found = draft.data.results.find(a => a.id === id)
                  if (found) found.isLiked = true
                },
              )

              patches.push(dispatch(patchAction))
              return true
            } else {
              return false
            }
          })

        try {
          await queryFulfilled
        } catch {
          patches.forEach(p => p.undo())
        }
      },
      invalidatesTags: (_, __, {id}) => [{type: 'Routes', id}],
    }),
    deleteRouteLike: build.mutation<AxiosResponse<void>, ReadRequest>({
      query: ({id, expand, ...params}) => ({
        url: `${id}/like/`,
        method: 'DELETE',
        params: {expand: prepareExpand(expand), ...params},
      }),
      async onQueryStarted({id}, {dispatch, queryFulfilled, getState}) {
        const patches: Array<PatchCollection> = []

        routesApi.util
          .selectInvalidatedBy(getState() as any, [{type: 'Routes', id}])
          .some(({endpointName, originalArgs}) => {
            if (endpointName === 'getRoutesList') {
              const patchAction = routesApi.util.updateQueryData(
                endpointName,
                originalArgs,
                draft => {
                  const found = draft.data.results.find(a => a.id === id)
                  if (found) found.isLiked = false
                },
              )

              patches.push(dispatch(patchAction))
              return true
            } else {
              return false
            }
          })

        try {
          await queryFulfilled
        } catch {
          patches.forEach(p => p.undo())
        }
      },
      invalidatesTags: (_, __, {id}) => [{type: 'Routes', id}],
    }),
  }),
})

export const {
  useGetRoutesListQuery,
  useLazyGetRoutesListQuery,
  useGetRouteQuery,
  useLazyGetRouteQuery,
  useCreateRouteLikeMutation,
  useDeleteRouteLikeMutation,
} = routesApi

export default routesApi
