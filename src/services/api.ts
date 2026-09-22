import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let token: string | null = null;

export function setAuthToken(authToken: string | null) {
  token = authToken;
  if (authToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// Auth endpoints
export const authAPI = {
  signup: (email: string, password: string, displayName: string, username: string) =>
    api.post('/auth/signup', { email, password, displayName, username }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
};

// Closet/Items endpoints
export const closetAPI = {
  addItem: (imageUri: string, brand?: string, category?: string, color?: string, size?: string, notes?: string) =>
    api.post('/closet/items', { imageUri, brand, category, color, size, notes }),
  getUserCloset: (userId: string, limit = 50, offset = 0) =>
    api.get(`/closet/${userId}/items`, { params: { limit, offset } }),
  getMyCloset: (limit = 50, offset = 0) =>
    api.get('/closet/items', { params: { limit, offset } }),
  deleteItem: (itemId: string) =>
    api.delete(`/closet/items/${itemId}`),
  getItem: (itemId: string) =>
    api.get(`/closet/items/${itemId}`),
  likeItem: (itemId: string) =>
    api.post(`/closet/items/${itemId}/like`),
  unlikeItem: (itemId: string) =>
    api.delete(`/closet/items/${itemId}/like`),
  getLikes: (itemId: string) =>
    api.get(`/closet/items/${itemId}/likes`),
  getFeed: (limit = 20, offset = 0) =>
    api.get('/closet/feed', { params: { limit, offset } }),
};

// Users/Profile endpoints
export const usersAPI = {
  getProfile: (userId: string) =>
    api.get(`/users/${userId}`),
  updateProfile: (userId: string, displayName?: string, bio?: string, avatarUrl?: string) =>
    api.patch(`/users/${userId}`, { displayName, bio, avatarUrl }),
  followUser: (userId: string) =>
    api.post(`/users/${userId}/follow`),
  unfollowUser: (userId: string) =>
    api.delete(`/users/${userId}/follow`),
  getFollowers: (userId: string, limit = 50, offset = 0) =>
    api.get(`/users/${userId}/followers`, { params: { limit, offset } }),
  getFollowing: (userId: string, limit = 50, offset = 0) =>
    api.get(`/users/${userId}/following`, { params: { limit, offset } }),
};

// Error handler
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      setAuthToken(null);
    }
    return Promise.reject(error.response?.data?.error || error.message);
  }
);

export default api;
