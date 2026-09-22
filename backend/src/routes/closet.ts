import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';
import * as clothingService from '../services/clothingService.js';

const router = Router();

// Add clothing item
router.post('/items', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { imageUri, brand, category, color, size, notes, purchaseDate, purchaseUrl } =
      req.body;

    if (!imageUri) {
      return res.status(400).json({ error: 'Image URI is required' });
    }

    const item = await clothingService.addClothingItem(req.userId!, imageUri, {
      brand,
      category: category || 'tops',
      color,
      size,
      notes,
      purchaseDate,
      purchaseUrl,
    });

    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's closet
router.get('/items', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const items = await clothingService.getUserCloset(req.userId!, limit, offset);
    res.json(items);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get specific user's closet (public)
router.get('/:userId/items', async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const items = await clothingService.getUserCloset(req.params.userId, limit, offset);
    res.json(items);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete clothing item
router.delete('/items/:itemId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await clothingService.deleteClothingItem(req.params.itemId, req.userId!);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get single item
router.get('/items/:itemId', async (req: AuthRequest, res: Response) => {
  try {
    const item = await clothingService.getClothingItem(req.params.itemId);
    res.json(item);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Like item
router.post('/items/:itemId/like', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const liked = await clothingService.likeItem(req.userId!, req.params.itemId);
    res.json({ liked });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Unlike item
router.delete(
  '/items/:itemId/like',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const unliked = await clothingService.unlikeItem(req.userId!, req.params.itemId);
      res.json({ unliked });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get likes count
router.get('/items/:itemId/likes', async (req: AuthRequest, res: Response) => {
  try {
    const count = await clothingService.getLikes(req.params.itemId);
    const liked = req.userId ? await clothingService.isItemLiked(req.userId, req.params.itemId) : false;
    res.json({ count, liked });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get feed
router.get('/feed', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const feed = await clothingService.getFeed(req.userId!, limit, offset);
    res.json(feed);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
