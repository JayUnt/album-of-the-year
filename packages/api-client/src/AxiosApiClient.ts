// logging for all requests
//  https://ppbruna.medium.com/developing-robust-api-clients-in-typescript-with-axios-1eecf70dbeb1


import Axios, {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import { v4 as uuidv4 } from "uuid";

import {ApiClient} from './ApiClient';
import {ApiError} from './ApiError';
import { HttpRequestError } from './HttpRequestError';
import { HttpRequestMethod } from './HttpRequestMethod';

type Props = {
  baseURL: string;
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<void>;
};

type RequestConfig = InternalAxiosRequestConfig & {
  excludeToken?: boolean;
  metadata?: {
    axiosId: string;
  };
};

type ErrorResponseData = {
  message?: string;
  detail?: string;
  errorCode?: string;
};

export class AxiosApiClient implements ApiClient {
  private axios: AxiosInstance;

  private getAccessToken: () => string | null = () => null;
  private refreshAccessToken: (() => Promise<void>) | null = null;

  constructor({baseURL, getAccessToken, refreshAccessToken}: Props) {
    this.getAccessToken = getAccessToken;
    this.refreshAccessToken = refreshAccessToken;

    this.axios = Axios.create({
      baseURL: baseURL,
    });

    this.axios.interceptors.request.use((config: RequestConfig) => {
      const {excludeToken} = config;
      const token = this.getAccessToken();

      if (!excludeToken && token) {
        config.headers!.Authorization = 'Bearer ' + token;
      }

      const axiosId = uuidv4();
      config.metadata = {
        axiosId: axiosId,
      };

      return config;
    });
    this.axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: any) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          this.getAccessToken() && // Make sure there is a token to begin with, if not, they arent logged in
          this.refreshAccessToken
        ) {
          originalRequest._retry = true;
          await this.refreshAccessToken();
          return this.axios(originalRequest);
        }

        if (
          Axios.isAxiosError(error) &&
          error.response &&
          error.response.data
        ) {
          const data = error.response?.data
            ? (error.response.data as ErrorResponseData)
            : ({} as ErrorResponseData);
          throw new ApiError(
            error.response.status,
            data.message || error.response.statusText,
            data.errorCode,
            data.detail
          );
        }
        throw new HttpRequestError(error.message);
      },
    );
  }

  async request<T = never>(config: {
    url: string;
    method: HttpRequestMethod;
    params?: any;
    data?: any;
    excludeToken?: boolean;
  }) {
    const response = await this.axios.request<T>(config);
    return response.data;
  }

  async fetch<T>(url: string, params?: any) {
    const response = await this.axios.request<T>({method: 'get', url, params});
    return response.data;
  }

  async fetchNullable<T>(url: string, params?: any) {
    const response = await this.axios.request<T>({method: 'get', url, params});
    return response.status === 204 ? null : response.data;
  }
}
