import { STORAGE_NAME } from '@app/hooks/useStorage';
import { BaseQueryFn } from '@reduxjs/toolkit/dist/query';
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  Method,
} from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL!;

export const initAxiosInstance = () => {
  const tokenPair = localStorage.getItem(STORAGE_NAME);
  axios.defaults.baseURL = BASE_URL;
  axios.interceptors.request.use(async config => {
    if (!config.headers) {
      config.headers = {} as AxiosHeaders;
    }
    if (tokenPair) {
      const { access: token } = JSON.parse(tokenPair);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = {
      baseUrl: BASE_URL,
    },
  ): BaseQueryFn<
    {
      url: string;
      method: Method;
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
      });
      return { data: result };
    } catch (axiosError) {
      let err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axios;
