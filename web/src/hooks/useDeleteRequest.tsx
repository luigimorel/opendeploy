import { API_URL } from '@/constants/config';
import { useAuthStore } from '@/stores/auth-store';
import { type UseMutationOptions, type UseMutationResult, useMutation } from '@tanstack/react-query';
import axios, { type AxiosRequestConfig } from 'axios';

import { handleServerError } from '@/lib/handle-server-error';

type UseDeleteOptions<TResponse, TVariables> = Omit<
  UseMutationOptions<TResponse, unknown, TVariables>,
  'mutationFn'
> & {
  config?: AxiosRequestConfig;
};

export function useDeleteRequest<TResponse = unknown, TVariables = unknown>(
  path: string | ((variables: TVariables) => string),
  options?: UseDeleteOptions<TResponse, TVariables>,
): UseMutationResult<TResponse, unknown, TVariables> {
  const { auth } = useAuthStore();
  const token = auth.accessToken;

  const mutationFn = async (variables: TVariables) => {
    const resolvedPath = typeof path === 'function' ? path(variables) : path;
    const url = `${API_URL}${resolvedPath}`;

    try {
      const response = await axios.delete(url, {
        ...(options?.config ?? {}),
        data: variables,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.config?.headers ?? {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      return response.data as TResponse;
    } catch (error) {
      handleServerError(error);
      throw error;
    }
  };

  return useMutation<TResponse, unknown, TVariables>({
    mutationFn,
    ...options,
  });
}
