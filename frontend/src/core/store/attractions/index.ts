import {createApi} from '@reduxjs/toolkit/query/react'
import {AxiosResponse} from 'axios'
import {axiosBaseQuery} from '@/core/services'
import {ListResponse} from 'types-responses'
import {Attraction, AttractionExpand, AttractionsFilters} from '@/core/models'
import {ListRequest, ReadRequest} from 'types-requests'
import {prepareExpand} from '@/core/utils'
import {PatchCollection} from '@reduxjs/toolkit/dist/query/core/buildThunks'

export const attractionsApi = createApi({
  reducerPath: 'attractions_api',
  baseQuery: axiosBaseQuery('/attractions/'),
  tagTypes: ['Attractions'],
  endpoints: build => ({
    getAttractionsList: build.query<
      AxiosResponse<ListResponse<Attraction>>,
      ListRequest<AttractionExpand, Partial<AttractionsFilters>>
    >({
      query: ({expand, filters, ...params}) => ({
        url: '',
        method: 'GET',
        params: {
          expand: prepareExpand(expand),
          status: 'PUBLISHED',
          ...filters,
          ...params,
        },
      }),
      transformResponse: (
        response: AxiosResponse<ListResponse<Attraction>>,
      ) => {
        response.data.results = response.data.results.map(
          u => new Attraction(u),
        )
        return response
      },
      providesTags: res =>
        res?.data.results.length
          ? [
              ...res.data.results.map(
                ({id}) => ({type: 'Attractions', id} as const),
              ),
            ]
          : [{type: 'Attractions', id: 'LIST'}],
    }),
    getAttraction: build.query<
      AxiosResponse<Attraction>,
      ReadRequest<AttractionExpand>
    >({
      query: ({id, expand, ...params}) => ({
        url: `${id}/`,
        method: 'GET',
        params: {
          expand: prepareExpand(expand),
          ...params,
        },
      }),
      transformResponse: (response: AxiosResponse<Attraction>) => {
        response.data = new Attraction(response.data)
        return response
      },
      providesTags: (_, __, {id}) => [{type: 'Attractions', id}],
    }),
    createAttractionLike: build.mutation<AxiosResponse<void>, ReadRequest>({
      query: ({id, expand, ...params}) => ({
        url: `${id}/favorite/`,
        method: 'POST',
        params: {expand: prepareExpand(expand), ...params},
      }),
      async onQueryStarted({id}, {dispatch, queryFulfilled, getState}) {
        const patches: Array<PatchCollection> = []

        attractionsApi.util
          .selectInvalidatedBy(getState() as any, [{type: 'Attractions', id}])
          .some(({endpointName, originalArgs}) => {
            if (endpointName === 'getAttractionsList') {
              const patchAction = attractionsApi.util.updateQueryData(
                endpointName,
                originalArgs,
                draft => {
                  const found = draft.data.results.find(a => a.id === id)
                  if (found) found.isFavorite = true
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
      invalidatesTags: (_, __, {id}) => [{type: 'Attractions', id}],
    }),
    deleteAttractionLike: build.mutation<AxiosResponse<void>, ReadRequest>({
      query: ({id, expand, ...params}) => ({
        url: `${id}/favorite/`,
        method: 'DELETE',
        params: {expand: prepareExpand(expand), ...params},
      }),
      async onQueryStarted({id}, {dispatch, queryFulfilled, getState}) {
        const patches: Array<PatchCollection> = []

        attractionsApi.util
          .selectInvalidatedBy(getState() as any, [{type: 'Attractions', id}])
          .some(({endpointName, originalArgs}) => {
            if (endpointName === 'getAttractionsList') {
              const patchAction = attractionsApi.util.updateQueryData(
                endpointName,
                originalArgs,
                draft => {
                  const found = draft.data.results.find(a => a.id === id)
                  if (found) found.isFavorite = false
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
      invalidatesTags: (_, __, {id}) => [{type: 'Attractions', id}],
    }),
  }),
})

export const {
  useGetAttractionsListQuery,
  useLazyGetAttractionsListQuery,
  useGetAttractionQuery,
  useLazyGetAttractionQuery,
  useCreateAttractionLikeMutation,
  useDeleteAttractionLikeMutation,
} = attractionsApi

export default attractionsApi
