import { Request, Response, NextFunction } from 'express';
import { Middleware } from '../types/express';

export const auth: Middleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }
  
  // Verify token and set user
  req.user = { id: 'user-id' }; // Replace with actual token verification
  next();
}; 