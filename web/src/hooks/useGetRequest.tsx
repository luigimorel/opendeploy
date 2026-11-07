import { API_URL } from '@/constants/config';
import { useAuthStore } from '@/stores/auth-store';
import { type UseQueryOptions, type UseQueryResult, useQuery } from '@tanstack/react-query';
import axios, { type AxiosRequestConfig } from 'axios';

import { handleServerError } from '@/lib/handle-server-error';

type GetFn<T> = () => Promise<T>;

type UseGetRequestOptions<T> = Omit<UseQueryOptions<T, unknown, T, readonly unknown[]>, 'queryKey' | 'queryFn'> & {
  path: string;
  config?: AxiosRequestConfig;
  queryKey?: readonly unknown[];
};

export function useGetRequest<T = unknown>(
  options: UseGetRequestOptions<T>,
): UseQueryResult<T, unknown> & { isAuthenticated: boolean; token: string } {
  const { path, config, queryKey, ...rest } = options;
  const { auth } = useAuthStore();

  const token = auth.accessToken;

  const queryFn: GetFn<T> = async () => {
    try {
      const response = await axios.get(`${API_URL}${path}`, {
        ...config,
        headers: {
          ...(config?.headers ?? {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      return response.data as T;
    } catch (error) {
      handleServerError(error);
      throw error;
    }
  };

  const result = useQuery<T, unknown, T, readonly unknown[]>({
    queryKey: queryKey ?? ['get', path, token],
    queryFn,
    enabled: rest.enabled ?? Boolean(token),
    ...rest,
  });

  return {
    ...result,
    isAuthenticated: Boolean(token),
    token,
  };
}
