import { Request, Response, NextFunction } from 'express';
import { auth } from './auth';
import { Middleware } from '../types/express';

type MiddlewareConfig = {
  methods?: string[];
  contentType?: string[];
  requireAuth?: boolean;
};

/**
 * Creates a middleware composition based on the provided configuration
 * @param config Configuration for the middleware composition
 * @returns A composed middleware function
 */
export const composeMiddleware = (config: MiddlewareConfig): Middleware => {
  const middlewares: Middleware[] = [];

  // Add method restriction if specified
  if (config.methods && config.methods.length > 0) {
    const allowedMethods = config.methods;
    middlewares.push((req: Request, res: Response, next: NextFunction) => {
      if (!allowedMethods.includes(req.method)) {
        res.status(405).json({ 
          error: 'Method Not Allowed',
          message: `Only ${allowedMethods.join(', ')} methods are supported`
        });
        return;
      }
      next();
    });
  }

  // Add content type validation if specified
  if (config.contentType && config.contentType.length > 0) {
    const allowedContentTypes = config.contentType;
    middlewares.push((req: Request, res: Response, next: NextFunction) => {
      const contentType = req.headers['content-type'];
      
      if (!contentType) {
        res.status(400).json({ error: 'Content-Type header is required' });
        return;
      }
      
      if (!allowedContentTypes.includes(contentType)) {
        res.status(415).json({ 
          error: 'Unsupported Media Type',
          message: `Content-Type must be one of: ${allowedContentTypes.join(', ')}`
        });
        return;
      }
      
      next();
    });
  }

  // Add authentication if required
  if (config.requireAuth) {
    // Use actual auth middleware to verify JWT and set req.user
    middlewares.push(auth);
  }

  // Compose all middlewares
  return (req: Request, res: Response, next: NextFunction) => {
    let index = 0;
    
    const runNext = () => {
      if (index < middlewares.length) {
        const middleware = middlewares[index++];
        middleware(req, res, (err?: any) => {
          if (err) {
            return next(err);
          }
          runNext();
        });
      } else {
        next();
      }
    };

    runNext();
  };
}; 