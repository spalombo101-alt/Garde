import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';
import * as userService from '../services/userService.js';
import { SignupRequest, AuthRequest as IAuthRequest } from '../types/index.js';

const router = Router();

router.post('/signup', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, displayName, username } = req.body;

    if (!email || !password || !displayName || !username) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await userService.signup({
      email,
      password,
      displayName,
      username,
    } as SignupRequest);

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const result = await userService.login({
      email,
      password,
    } as IAuthRequest);

    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await userService.getUserById(req.userId!);
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
