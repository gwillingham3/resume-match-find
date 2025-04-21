import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { validateContentType } from '../middleware/contentType';
import { restrictMethods } from '../middleware/methodRestriction';
import { isValidEmail, isStrongPassword, getPasswordRequirements } from '../utils/validation';

const router = express.Router();

// Register - Only allow POST
router.post('/register', 
  restrictMethods(['POST']),
  validateContentType(['application/json']),
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
        process.env.JWT_SECRET || 'your-secret-key',
        { 
          expiresIn: '7d',
          algorithm: 'HS256' as const
        }
      );
      
      res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
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
  restrictMethods(['POST']),
  validateContentType(['application/json']),
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
        process.env.JWT_SECRET || 'your-secret-key',
        { 
          expiresIn: '7d',
          algorithm: 'HS256' as const
        }
      );
      
      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router; 