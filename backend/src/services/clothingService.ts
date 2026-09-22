import { query } from '@db/connect.js';
import { ClothingItem } from '@types/index.js';
import { v4 as uuid } from 'uuid';

export async function addClothingItem(
  userId: string,
  imageUrl: string,
  data: Partial<ClothingItem>
) {
  const itemId = uuid();

  const result = await query(
    `INSERT INTO clothing_items
     (id, user_id, image_url, brand, category, color, size, notes, purchase_date, purchase_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      itemId,
      userId,
      imageUrl,
      data.brand || null,
      data.category || 'tops',
      data.color || null,
      data.size || null,
      data.notes || null,
      data.purchaseDate || null,
      data.purchaseUrl || null,
    ]
  );

  return formatClothingItem(result.rows[0]);
}

export async function getUserCloset(userId: string, limit = 50, offset = 0) {
  const result = await query(
    `SELECT * FROM clothing_items
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return result.rows.map(formatClothingItem);
}

export async function getClothingItem(itemId: string) {
  const result = await query(
    'SELECT * FROM clothing_items WHERE id = $1',
    [itemId]
  );

  if (result.rows.length === 0) {
    throw new Error('Clothing item not found');
  }

  return formatClothingItem(result.rows[0]);
}

export async function deleteClothingItem(itemId: string, userId: string) {
  const result = await query(
    'DELETE FROM clothing_items WHERE id = $1 AND user_id = $2 RETURNING id',
    [itemId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Clothing item not found or unauthorized');
  }

  return result.rows[0];
}

export async function likeItem(userId: string, itemId: string) {
  // Check if item exists
  const item = await query('SELECT id FROM clothing_items WHERE id = $1', [itemId]);
  if (item.rows.length === 0) {
    throw new Error('Item not found');
  }

  const likeId = uuid();

  try {
    await query(
      'INSERT INTO likes (id, user_id, item_id) VALUES ($1, $2, $3)',
      [likeId, userId, itemId]
    );
  } catch (error: any) {
    if (error.code === '23505') {
      // Unique constraint violation - already liked
      return false;
    }
    throw error;
  }

  return true;
}

export async function unlikeItem(userId: string, itemId: string) {
  const result = await query(
    'DELETE FROM likes WHERE user_id = $1 AND item_id = $2',
    [userId, itemId]
  );

  return result.rowCount > 0;
}

export async function getLikes(itemId: string) {
  const result = await query(
    'SELECT COUNT(*) as count FROM likes WHERE item_id = $1',
    [itemId]
  );

  return parseInt(result.rows[0].count);
}

export async function isItemLiked(userId: string, itemId: string) {
  const result = await query(
    'SELECT id FROM likes WHERE user_id = $1 AND item_id = $2',
    [userId, itemId]
  );

  return result.rows.length > 0;
}

export async function getFeed(userId: string, limit = 20, offset = 0) {
  // Get items from followed users
  const result = await query(
    `SELECT
       ci.id, ci.user_id, ci.image_url, ci.brand, ci.category,
       ci.color, ci.size, ci.notes, ci.purchase_date, ci.purchase_url,
       ci.created_at, ci.updated_at,
       u.id as user_id, u.username, u.display_name, u.avatar_url,
       COALESCE(l.like_count, 0) as like_count,
       CASE WHEN ul.id IS NOT NULL THEN true ELSE false END as liked
     FROM clothing_items ci
     JOIN users u ON ci.user_id = u.id
     LEFT JOIN (
       SELECT item_id, COUNT(*) as like_count FROM likes GROUP BY item_id
     ) l ON ci.id = l.item_id
     LEFT JOIN likes ul ON ci.id = ul.item_id AND ul.user_id = $1
     WHERE ci.user_id IN (
       SELECT following_id FROM follows WHERE follower_id = $1
     ) OR ci.user_id = $1
     ORDER BY ci.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    imageUrl: row.image_url,
    brand: row.brand,
    category: row.category,
    color: row.color,
    size: row.size,
    notes: row.notes,
    purchaseDate: row.purchase_date,
    purchaseUrl: row.purchase_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    user: {
      id: row.user_id,
      username: row.username,
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
    },
    likes: row.like_count,
    liked: row.liked,
  }));
}

function formatClothingItem(row: any): ClothingItem {
  return {
    id: row.id,
    userId: row.user_id,
    imageUrl: row.image_url,
    brand: row.brand,
    category: row.category,
    color: row.color,
    size: row.size,
    notes: row.notes,
    purchaseDate: row.purchase_date,
    purchaseUrl: row.purchase_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
