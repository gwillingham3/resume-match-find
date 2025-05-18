import { Request, Response, NextFunction } from 'express';
import { Middleware } from '../types/express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const auth: Middleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const jwtSecret = process.env.NODE_ENV === 'test' ? 'test-secret' : process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: string };

    // Fetch the user from the database
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      resumeIds: user.resumeIds.map(String),
    };

    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};
