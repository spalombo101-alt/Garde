import { Router, Response } from 'express';
import { AuthRequest, authMiddleware, optionalAuth } from '@middleware/auth.js';
import * as userService from '@services/userService.js';
import * as followService from '@services/followService.js';

const router = Router();

// Get user profile
router.get('/:userId', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await userService.getUserProfile(req.params.userId, req.userId);
    res.json(profile);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// Update user profile
router.patch('/:userId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.params.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await userService.updateProfile(req.userId!, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Follow user
router.post('/:userId/follow', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const followed = await followService.followUser(req.userId!, req.params.userId);
    res.json({ followed });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Unfollow user
router.delete(
  '/:userId/follow',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const unfollowed = await followService.unfollowUser(req.userId!, req.params.userId);
      res.json({ unfollowed });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get followers
router.get('/:userId/followers', async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const followers = await followService.getFollowers(req.params.userId, limit, offset);
    res.json(followers);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get following
router.get('/:userId/following', async (req: AuthRequest, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const following = await followService.getFollowing(req.params.userId, limit, offset);
    res.json(following);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
