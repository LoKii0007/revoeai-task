 import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    // Mock login - in production, this would make an API call
    set({
      user: {
        id: '1',
        name: 'Demo User',
        email,
      },
      isAuthenticated: true,
    });
  },
  signup: async (name: string, email: string, id : string) => {
    // Mock signup - in production, this would make an API call
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