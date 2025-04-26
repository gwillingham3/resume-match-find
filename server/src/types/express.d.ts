import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

export type RouteHandler = (
  req: Request,
  res: Response
) => Promise<void>;
