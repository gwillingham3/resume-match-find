vi.mock('../../../src/models/User');
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { auth } from '../../../src/middleware/auth';
import { User } from '../../../src/models/User';
import mongoose from 'mongoose';

describe('Auth Middleware', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
    console.error = vi.fn(); // Suppress console.error output
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if no token is provided', async () => {
    await auth(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
  });

  it('should return 401 if token is invalid', async () => {
    req.headers.authorization = 'Bearer invalidtoken';
    jwt.verify = vi.fn().mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await auth(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });

  it('should attach user to request if token is valid', async () => {
    const userId = new mongoose.Types.ObjectId();
    const email = 'test@example.com';
    const name = 'Test User';
    const avatar = 'avatar.jpg';
    const resumeIds = [new mongoose.Types.ObjectId()];
    const token = 'testtoken';
    req.headers.authorization = `Bearer ${token}`;

    jwt.verify = vi.fn().mockImplementation(() => ({ userId: userId.toString() }));

    const findByIdSpy = vi.spyOn(User, 'findById');
    const MockUser = mongoose.model('MockUser', new mongoose.Schema({
      name: String,
      email: String,
      avatar: String,
      resumeIds: [mongoose.Schema.Types.ObjectId],
    }));

    const mockUser = new MockUser({
      _id: userId,
      email: email,
      name: name,
      avatar: avatar,
      resumeIds: resumeIds,
    });

    findByIdSpy.mockResolvedValue(mockUser);

    await auth(req as Request, res as Response, next as NextFunction);

    expect(User.findById).toHaveBeenCalledWith(userId.toString());
    expect(req.user).toEqual({
      id: userId.toString(),
      name: name,
      email: email,
      avatar: avatar,
      resumeIds: resumeIds.map(String),
    });
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if user is not found in the database', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const token = jwt.sign({ userId }, 'your-secret-key');
    req.headers.authorization = `Bearer ${token}`;

    jwt.verify = vi.fn().mockReturnValue({ userId });

    (User.findById as any).mockResolvedValue(null);

    await auth(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });

  it('should handle errors when fetching user from the database', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const token = jwt.sign({ userId }, 'your-secret-key');
    req.headers.authorization = `Bearer ${token}`;

    jwt.verify = vi.fn().mockReturnValue({ userId });

    (User.findById as any).mockRejectedValue(new Error('Database error'));

    await auth(req as Request, res as Response, next as NextFunction);

    expect(console.error).toHaveBeenCalledWith("Invalid token:", new Error('Database error'));
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });

  it('should handle JWT_SECRET not configured', async () => {
    const originalEnv = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    try {
      await auth(req as Request, res as Response, next as NextFunction);
      if (process.env.NODE_ENV !== 'test') {
        expect(console.error).toHaveBeenCalledWith("Invalid token:", new Error('JWT_SECRET is not configured'));
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
      }
    } finally {
      process.env.JWT_SECRET = originalEnv;
    }
  });

  it('should return 401 if token format is invalid', async () => {
    req.headers.authorization = 'Invalidtoken';

    await auth(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
  });

  it('should return 401 if token is expired', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const expiredToken = jwt.sign({ userId }, 'your-secret-key', { expiresIn: '0s' });
    req.headers.authorization = `Bearer ${expiredToken}`;

    jwt.verify = vi.fn().mockImplementation(() => {
      throw new jwt.TokenExpiredError('jwt expired', new Date());
    });

    await auth(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });
});
