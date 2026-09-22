import { query } from '../db/connect.js';
import { v4 as uuid } from 'uuid';

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) {
    throw new Error('Cannot follow yourself');
  }

  const followId = uuid();

  try {
    await query(
      'INSERT INTO follows (id, follower_id, following_id) VALUES ($1, $2, $3)',
      [followId, followerId, followingId]
    );
  } catch (error: any) {
    if (error.code === '23505') {
      // Already following
      return false;
    }
    throw error;
  }

  return true;
}

export async function unfollowUser(followerId: string, followingId: string) {
  const result = await query(
    'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
    [followerId, followingId]
  );

  return (result.rowCount || 0) > 0;
}

export async function isFollowing(followerId: string, followingId: string) {
  const result = await query(
    'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
    [followerId, followingId]
  );

  return result.rows.length > 0;
}

export async function getFollowers(userId: string, limit = 50, offset = 0) {
  const result = await query(
    `SELECT u.id, u.username, u.display_name, u.avatar_url, u.bio
     FROM users u
     JOIN follows f ON u.id = f.follower_id
     WHERE f.following_id = $1
     ORDER BY f.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return result.rows.map((row: any) => ({
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
  }));
}

export async function getFollowing(userId: string, limit = 50, offset = 0) {
  const result = await query(
    `SELECT u.id, u.username, u.display_name, u.avatar_url, u.bio
     FROM users u
     JOIN follows f ON u.id = f.following_id
     WHERE f.follower_id = $1
     ORDER BY f.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return result.rows.map((row: any) => ({
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
  }));
}

export async function getFollowerCount(userId: string) {
  const result = await query(
    'SELECT COUNT(*) as count FROM follows WHERE following_id = $1',
    [userId]
  );

  return parseInt(result.rows[0].count);
}

export async function getFollowingCount(userId: string) {
  const result = await query(
    'SELECT COUNT(*) as count FROM follows WHERE follower_id = $1',
    [userId]
  );

  return parseInt(result.rows[0].count);
}
