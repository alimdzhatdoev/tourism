import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios'
import {BaseQueryFn} from '@reduxjs/toolkit/dist/query'
import {appStorage, handleError} from '@core/utils'
import {ErrorResponse} from 'types-responses'
import {setMiscState} from '../store/misc'
import {Mutex} from 'async-mutex'
import {getRuntimeEnv} from 'vite-runtime-env-script-plugin/getRuntimeEnv'
import {Tokens} from 'types-common'

const mutex = new Mutex()
const storage = appStorage()

export const BASE_URL = getRuntimeEnv('BASE_URL') + '/api'
const REFRESH_PATH = '/token/refresh/'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
})

axiosInstance.interceptors.request.use(async config => {
  const accessToken = storage.read('tokens')?.access
  if (!config.headers) {
    config.headers = {} as AxiosHeaders
  }
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

const axiosBaseQuery =
  (
    endpointUrl: string = '',
  ): BaseQueryFn<
    {
      url: string
      method: Method
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
    },
    unknown,
    AxiosError<ErrorResponse>
  > =>
  async ({url, method, data, params}) => {
    try {
      const result = await axiosInstance({
        url: axiosInstance.defaults.baseURL + endpointUrl + url,
        method,
        data,
        params,
      })
      return {data: result}
    } catch (axiosError) {
      let error = axiosError as AxiosError<ErrorResponse>
      return {error}
    }
  }

const refresh = async (
  refreshToken: Tokens['refresh'],
  onSuccess: () => Promise<void>,
) => {
  try {
    const {data} = await axios<any, AxiosResponse<Tokens>>({
      url: BASE_URL + REFRESH_PATH,
      method: 'POST',
      data: {
        refreshToken,
      },
    })
    setMiscState({isAuthorized: true})
    storage.write('tokens', data)
    await onSuccess()
  } catch (error) {
    handleError(error)
    setMiscState({isAuthorized: false})
    storage.remove('tokens')
  }
}

export const axiosBaseQueryWithReauth =
  (
    endpointUrl: string = '',
  ): BaseQueryFn<
    {
      url: string
      method: Method
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
    },
    unknown,
    AxiosError<ErrorResponse>
  > =>
  async (args, api, extraOptions) => {
    await mutex.waitForUnlock()
    let result = await axiosBaseQuery(endpointUrl)(args, api, extraOptions)
    if (result.error && result.error.response?.status === 401) {
      if (!mutex.isLocked()) {
        const refreshToken = storage.read('tokens')?.refresh
        if (!refreshToken) {
          return result
        }
        const release = await mutex.acquire()
        await refresh(refreshToken, async () => {
          result = await axiosBaseQuery(endpointUrl)(args, api, extraOptions)
        })
        release()
      } else {
        await mutex.waitForUnlock()
        result = await axiosBaseQuery(endpointUrl)(args, api, extraOptions)
      }
    }
    return result
  }
