import { API_URL } from '@/constants/config';
import { useAuthStore } from '@/stores/auth-store';
import { type UseMutationOptions, type UseMutationResult, useMutation } from '@tanstack/react-query';
import axios, { type AxiosRequestConfig } from 'axios';

import { handleServerError } from '@/lib/handle-server-error';

type UsePostOptions<TResponse, TVariables> = Omit<UseMutationOptions<TResponse, unknown, TVariables>, 'mutationFn'> & {
  config?: AxiosRequestConfig;
};

export function usePostRequest<TResponse = unknown, TVariables = unknown>(
  path: string,
  options?: UsePostOptions<TResponse, TVariables>,
): UseMutationResult<TResponse, unknown, TVariables> {
  const { auth } = useAuthStore();
  const token = auth.accessToken;

  const mutationFn = async (variables: TVariables) => {
    try {
      const response = await axios.post(`${API_URL}${path}`, variables, {
        ...(options?.config ?? {}),
        headers: {
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
