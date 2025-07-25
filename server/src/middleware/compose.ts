import { Request, Response, NextFunction } from 'express';
import { auth } from './auth';
import { cacheService } from '../services/redis';
import { Middleware } from '../types/express';

type MiddlewareConfig = {
  methods?: string[];
  contentType?: string[];
  requireAuth?: boolean;
  rateLimit?: {
    windowMs: number;
    max: number;
  };
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
        console.log('Method Not Allowed:', req.method, allowedMethods);
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
        console.log('Content Type Not Allowed:', contentType, allowedContentTypes);
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

    if (config.rateLimit) {
    const { windowMs, max } = config.rateLimit;
    middlewares.push(async (req: Request, res: Response, next: NextFunction) => {
      const ip = req.ip || req.socket.remoteAddress;

      if (!ip) {
        console.warn('Could not determine IP address for rate limiting');
        return next();
      }

      const key = `rateLimit:${ip}`;
      const requests = await cacheService.get(key);
      const numRequests = requests ? parseInt(requests, 10) : 0;

      if (numRequests >= max) {
        console.log('Rate Limit Exceeded:', ip, numRequests, max);
        res.status(429).json({ error: 'Too many requests, please try again later.' });
        return;
      }

      await cacheService.set(key, (numRequests + 1).toString(), windowMs / 1000);
      next();
    });
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
