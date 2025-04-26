import { Request, Response, NextFunction } from 'express';
import { Middleware } from '../types/express';
import jwt from 'jsonwebtoken';

export const auth: Middleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    console.log("Decoded token:", decoded);
    req.user = { id: decoded.userId };
    console.log("req.user:", req.user);
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};
