import { create } from 'zustand';
import { ClothingItem, Feed } from '@types/index';

interface ClosetStore {
  items: ClothingItem[];
  feed: Feed[];
  isLoading: boolean;
  fetchUserCloset: (userId: string) => Promise<void>;
  fetchFeed: () => Promise<void>;
  addClothingItem: (item: Omit<ClothingItem, 'id' | 'createdAt'>) => Promise<void>;
  deleteClothingItem: (itemId: string) => Promise<void>;
  likeItem: (itemId: string) => Promise<void>;
  setIsLoading: (loading: boolean) => void;
}

export const useClosetStore = create<ClosetStore>((set, get) => ({
  items: [],
  feed: [],
  isLoading: false,

  setIsLoading: (isLoading) => set({ isLoading }),

  fetchUserCloset: async (userId: string) => {
    set({ isLoading: true });
    try {
      // TODO: Call API to fetch user's closet
      // const response = await api.get(`/users/${userId}/closet`);
      // set({ items: response.items });
    } catch (error) {
      console.error('Failed to fetch closet:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeed: async () => {
    set({ isLoading: true });
    try {
      // TODO: Call API to fetch feed
      // const response = await api.get('/feed');
      // set({ feed: response.feed });
    } catch (error) {
      console.error('Failed to fetch feed:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addClothingItem: async (item) => {
    try {
      // TODO: Call API to upload image and save item
      // const formData = new FormData();
      // formData.append('image', { uri: item.imageUri, type: 'image/jpeg', name: 'clothing.jpg' });
      // formData.append('brand', item.brand);
      // formData.append('category', item.category);
      // const response = await api.post('/closet/items', formData);
      // set((state) => ({ items: [...state.items, response.item] }));
    } catch (error) {
      console.error('Failed to add clothing item:', error);
      throw error;
    }
  },

  deleteClothingItem: async (itemId: string) => {
    try {
      // TODO: Call API to delete item
      // await api.delete(`/closet/items/${itemId}`);
      set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
      }));
    } catch (error) {
      console.error('Failed to delete item:', error);
      throw error;
    }
  },

  likeItem: async (itemId: string) => {
    try {
      // TODO: Call API to like item
      // await api.post(`/items/${itemId}/like`);
    } catch (error) {
      console.error('Failed to like item:', error);
      throw error;
    }
  },
}));
