import { Request, Response, NextFunction } from 'express';

export const restrictMethods = (allowedMethods: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedMethods.includes(req.method)) {
      res.status(405).json({ 
        error: 'Method Not Allowed',
        message: `Only ${allowedMethods.join(', ')} methods are allowed on this route`
      });
      return;
    }
    next();
  };
}; 