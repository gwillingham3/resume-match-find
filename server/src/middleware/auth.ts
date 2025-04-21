import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('No token provided');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }) as JwtPayload & { id: string };
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }
    
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'JWT_SECRET is not configured') {
        res.status(500).json({ error: 'Server configuration error' });
      } else if (error.message === 'No token provided') {
        res.status(401).json({ error: 'Please authenticate' });
      } else if (error.message === 'Token expired') {
        res.status(401).json({ error: 'Token expired. Please login again.' });
      } else if (error.message === 'jwt expired') {
        res.status(401).json({ error: 'Token expired. Please login again.' });
      } else if (error.message === 'invalid algorithm') {
        res.status(401).json({ error: 'Invalid token algorithm' });
      } else {
        res.status(401).json({ error: 'Invalid token' });
      }
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  }
}; 