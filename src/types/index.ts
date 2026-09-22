export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
}

export interface ClothingItem {
  id: string;
  userId: string;
  imageUri: string;
  brand?: string;
  category: 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'shoes' | 'accessories';
  color?: string;
  size?: string;
  notes?: string;
  purchaseDate?: Date;
  purchaseUrl?: string;
  createdAt: Date;
}

export interface Outfit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  items: string[]; // ClothingItem IDs
  imageUri?: string;
  createdAt: Date;
}

export interface Feed {
  id: string;
  userId: string;
  user: User;
  type: 'item' | 'outfit';
  contentId: string; // ClothingItem or Outfit ID
  content: ClothingItem | Outfit;
  likes: number;
  liked: boolean;
  createdAt: Date;
}

export interface UserProfile extends User {
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  clothingItemsCount: number;
}
