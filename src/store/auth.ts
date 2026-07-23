import { create } from "zustand";

interface AuthState {
  token: string | null;
  backendUrl: string | null;
  setToken: (token: string, backendUrl: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  backendUrl: null,
  setToken: (token, backendUrl) => set({ token, backendUrl }),
  clearAuth: () => set({ token: null, backendUrl: null }),
}));