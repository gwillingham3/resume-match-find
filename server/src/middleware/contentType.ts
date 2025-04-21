import { Request, Response, NextFunction } from 'express';

export const validateContentType = (allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentType = req.headers['content-type'];
    
    if (!contentType) {
      res.status(400).json({ error: 'Content-Type header is required' });
      return;
    }
    
    if (!allowedTypes.includes(contentType)) {
      res.status(415).json({ 
        error: 'Unsupported Media Type',
        message: `Content-Type must be one of: ${allowedTypes.join(', ')}`
      });
      return;
    }
    
    next();
  };
}; 