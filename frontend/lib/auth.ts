 import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, token: string, userId: string) => Promise<void>;
  signup: (name: string, email: string, id : string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({

  user: null,
  isAuthenticated: false,
  login: async (email: string, token: string, userId: string) => {
    set({
      user: {
        id: userId,
        name: email,
        email,
      },
      isAuthenticated: true,
    });
  },
  signup: async (name: string, email: string, id : string) => {
    set({
      user: {
        id,
        name,
        email,
      },
      isAuthenticated: true,
    });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));