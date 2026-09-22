import { create } from 'zustand';
import { User } from '@types/index';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isSignedIn: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  restoreToken: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isSignedIn: false,

  setUser: (user) => set({ user, isSignedIn: !!user }),
  setToken: (token) => set({ token }),
  setIsLoading: (isLoading) => set({ isLoading }),

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      // TODO: Call API
      // const response = await api.post('/auth/login', { email, password });
      // set({ user: response.user, token: response.token, isSignedIn: true });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (email: string, password: string, displayName: string) => {
    set({ isLoading: true });
    try {
      // TODO: Call API
      // const response = await api.post('/auth/signup', { email, password, displayName });
      // set({ user: response.user, token: response.token, isSignedIn: true });
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, token: null, isSignedIn: false });
  },

  restoreToken: async () => {
    set({ isLoading: true });
    try {
      // TODO: Restore token from secure storage
      // const token = await SecureStore.getItemAsync('token');
      // if (token) {
      //   const user = await api.get('/auth/me');
      //   set({ token, user, isSignedIn: true });
      // }
    } catch (error) {
      console.error('Token restore failed:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
