import { create } from 'zustand';

interface AuthState {
  accessToken: string;
}

interface AuthStore {
  auth: AuthState;
  setAccessToken: (accessToken: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  auth: { accessToken: '' },
  setAccessToken: (accessToken) => set({ auth: { accessToken: accessToken ?? '' } }),
  clearAuth: () => set({ auth: { accessToken: '' } }),
}));
