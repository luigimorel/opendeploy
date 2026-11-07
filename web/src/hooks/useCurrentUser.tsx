import type { User } from '@/types';

import { useGetRequest } from './useGetRequest';

type MeResponse = {
  user: User;
};

export function useCurrentUser() {
  const { data, isLoading, isError } = useGetRequest<MeResponse>({
    path: '/auth/account/me',
    queryKey: ['personal-data'],
  });

  const user = data?.user ?? null;
  const role = user?.role ?? user?.metadata?.user_role ?? null;

  return {
    user,
    role,
    isLoading,
    isError,
  };
}
