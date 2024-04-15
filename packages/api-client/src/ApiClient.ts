import { HttpRequestMethod } from "./HttpRequestMethod";

export interface ApiClient {
  fetch: <T>(
    url: string,
    params?: any,
    config?: {
      timeout?: number;
    },
  ) => Promise<T>;
  fetchNullable: <T>(
    url: string,
    params?: any,
    config?: {timeout?: number},
  ) => Promise<T | null>;
  request: <T = never>(config: {
    url: string;
    method: HttpRequestMethod;
    params?: any;
    data?: any;
    headers?: any;
    timeout?: number;
    excludeToken?: boolean;
  }) => Promise<T>;
}
