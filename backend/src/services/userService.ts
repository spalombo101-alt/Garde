import { query } from '../db/connect.js';
import { User, SignupRequest, AuthRequest } from '../types/index.js';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth.js';
import { v4 as uuid } from 'uuid';

export async function signup(req: SignupRequest) {
  const { email, password, displayName, username } = req;

  // Check if user exists
  const existingUser = await query(
    'SELECT id FROM users WHERE email = $1 OR username = $2',
    [email, username]
  );

  if (existingUser.rows.length > 0) {
    throw new Error('Email or username already in use');
  }

  const passwordHash = await hashPassword(password);
  const userId = uuid();

  await query(
    `INSERT INTO users (id, email, username, display_name, password_hash)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, email, username, displayName, passwordHash]
  );

  const token = generateToken(userId, email);

  return {
    user: {
      id: userId,
      email,
      username,
      displayName,
    },
    token,
  };
}

export async function login(req: AuthRequest) {
  const { email, password } = req;

  const result = await query('SELECT * FROM users WHERE email = $1', [email]);

  if (result.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result.rows[0];
  const isValid = await verifyPassword(password, user.password_hash);

  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user.id, email);

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.display_name,
      bio: user.bio,
      avatarUrl: user.avatar_url,
    },
    token,
  };
}

export async function getUserById(userId: string) {
  const result = await query(
    `SELECT id, email, username, display_name, bio, avatar_url, created_at
     FROM users WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  const user = result.rows[0];
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    displayName: user.display_name,
    bio: user.bio,
    avatarUrl: user.avatar_url,
    createdAt: user.created_at,
  };
}

export async function getUserProfile(userId: string, currentUserId?: string) {
  const user = await getUserById(userId);

  // Get stats
  const itemsResult = await query(
    'SELECT COUNT(*) as count FROM clothing_items WHERE user_id = $1',
    [userId]
  );

  const followersResult = await query(
    'SELECT COUNT(*) as count FROM follows WHERE following_id = $1',
    [userId]
  );

  const followingResult = await query(
    'SELECT COUNT(*) as count FROM follows WHERE follower_id = $1',
    [userId]
  );

  // Check if current user follows this user
  let isFollowing = false;
  if (currentUserId && currentUserId !== userId) {
    const followResult = await query(
      'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
      [currentUserId, userId]
    );
    isFollowing = followResult.rows.length > 0;
  }

  return {
    ...user,
    clothingItemsCount: parseInt(itemsResult.rows[0].count),
    followersCount: parseInt(followersResult.rows[0].count),
    followingCount: parseInt(followingResult.rows[0].count),
    isFollowing,
  };
}

export async function updateProfile(userId: string, updates: Partial<User>) {
  const { displayName, bio, avatarUrl } = updates;

  const result = await query(
    `UPDATE users
     SET display_name = COALESCE($1, display_name),
         bio = COALESCE($2, bio),
         avatar_url = COALESCE($3, avatar_url),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING id, email, username, display_name, bio, avatar_url`,
    [displayName, bio, avatarUrl, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }

  return result.rows[0];
}
