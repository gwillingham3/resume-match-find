import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const checkDbConnection = (req: Request, res: Response, next: NextFunction) => {
  if (mongoose.connection.readyState !== 1) { // 1 = connected
    res.status(503).json({ 
      error: 'Service Unavailable',
      message: 'Database connection is not available. Please try again later.'
    });
    return;
  }
  next();
}; 