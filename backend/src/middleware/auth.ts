import { Request, Response, NextFunction } from 'express';
import { extractToken, verifyToken } from '@utils/auth.js';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.userId = payload.userId;
  req.userEmail = payload.email;
  next();
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = extractToken(req.headers.authorization);

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.userId = payload.userId;
      req.userEmail = payload.email;
    }
  }

  next();
}
