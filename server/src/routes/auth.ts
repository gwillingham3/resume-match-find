import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { composeMiddleware } from '../middleware/compose';
import { isValidEmail, isStrongPassword, getPasswordRequirements } from '../utils/validation';
import { cacheService } from '../services/redis';

const router = express.Router();

const rateLimit = (windowMs: number, max: number) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress;

    if (!ip) {
      console.warn('Could not determine IP address for rate limiting');
      return next();
    }

    const key = `rateLimit:${ip}`;
    const requests = await cacheService.get(key);
    const numRequests = requests ? parseInt(requests, 10) : 0;

    if (numRequests >= max) {
      res.status(429).json({ error: 'Too many requests, please try again later.' });
      return;
    }

    await cacheService.set(key, (numRequests + 1).toString(), windowMs / 1000);
    next();
  };
};

// Validate JWT configuration
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error('JWT_SECRET is missing from environment variables');
  throw new Error('JWT_SECRET environment variable is required');
}

// JWT options
const jwtOptions: jwt.SignOptions = {
  expiresIn: '7d', // This is a valid StringValue for jsonwebtoken
  algorithm: 'HS256' as const
};

// Register - Only allow POST
router.post('/register', 
  composeMiddleware({
    methods: ['POST'],
    contentType: ['application/json']
  }),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      // Validate email format
      if (!isValidEmail(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
      }
      
      // Validate password strength
      if (!isStrongPassword(password)) {
        res.status(400).json({ 
          error: 'Weak password',
          requirements: getPasswordRequirements()
        });
        return;
      }
      
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ error: 'User already exists' });
        return;
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create user
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });
      
      await user.save();
      
      // Create token
      const token = jwt.sign(
        { userId: user._id },
        jwtSecret,
        jwtOptions
      );
      
      res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          resumeIds: user.resumeIds,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Login - Only allow POST
router.post('/login',
  composeMiddleware({
    methods: ['POST'],
    contentType: ['application/json'],
    rateLimit: {
      windowMs: 60000,
      max: 10,
    },
  }),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ error: 'Invalid credentials' });
        return;
      }
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ error: 'Invalid credentials' });
        return;
      }
      
      // Create token
      const token = jwt.sign(
        { userId: user._id },
        jwtSecret,
        jwtOptions
      );
      
      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          resumeIds: user.resumeIds,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Verify token - Only allow GET
router.get('/verify', 
  composeMiddleware({
    methods: ['GET'],
    requireAuth: true
  }),
  async (req, res) => {
    try {
      // If we reach here, the token is valid (handled by middleware)
      res.json({ valid: true });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Logout - Only allow POST
router.post('/logout', 
  composeMiddleware({
    methods: ['POST'],
    requireAuth: true
  }),
  async (req, res) => {
    try {
      // Simply return a success message, as JWT invalidation is complex
      res.json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update profile - Only allow PUT
router.put('/profile',
  composeMiddleware({
    methods: ['PUT'],
    requireAuth: true,
    contentType: ['application/json']
  }),
  async (req, res) => {
    try {
      const { name, email } = req.body;

      // Validate email format
      if (!isValidEmail(email)) {
        res.status(400).json({ error: 'Invalid email format' });
        return;
      }

      // Find user
      const user = await User.findById((req.user as { id: string }).id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Update user
      user.name = name;
      user.email = email;
      await user.save();

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          resumeIds: user.resumeIds,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;
