export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  passwordHash: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClothingItem {
  id: string;
  userId: string;
  imageUrl: string;
  brand?: string;
  category: 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'shoes' | 'accessories';
  color?: string;
  size?: string;
  notes?: string;
  purchaseDate?: Date;
  purchaseUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Outfit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  itemIds: string[];
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Like {
  id: string;
  userId: string;
  itemId: string;
  createdAt: Date;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface SignupRequest extends AuthRequest {
  displayName: string;
  username: string;
}
