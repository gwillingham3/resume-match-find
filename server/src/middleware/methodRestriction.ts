import { Request, Response, NextFunction } from 'express';
import { Middleware } from '../types/express';

export const restrictMethods = (allowedMethods: string[]): Middleware => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!allowedMethods.includes(req.method)) {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    next();
  };
}; 