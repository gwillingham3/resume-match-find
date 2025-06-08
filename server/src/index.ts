require('dotenv').config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth';
import resumeRoutes from './routes/resume';
import jobRoutes from './routes/jobs';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic HTTP request logging
app.use(morgan('dev'));

// Global method restriction middleware
app.use((req, res, next) => {
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  if (!allowedMethods.includes(req.method)) {
    console.warn(`Method not allowed: ${req.method} ${req.url}`);
    res.status(405).json({ 
      error: 'Method Not Allowed',
      message: `Only ${allowedMethods.join(', ')} methods are supported`
    });
    return;
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB with retry logic
const connectWithRetry = async (retries = 3, delay = 1000) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobmatch');
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    if (retries > 0) {
      console.error(`Failed to connect to MongoDB, retrying in ${delay}ms... (${retries} attempts left)`);
      setTimeout(() => connectWithRetry(retries - 1, delay * 2), delay);
    } else {
      console.error('Failed to connect to MongoDB after all retry attempts:', error);
      process.exit(1);
    }
  }
};

connectWithRetry();
setInterval(() => {
    const used = process.memoryUsage();
    console.log('Memory usage:', {
        rss: Math.round(used.rss / 1024 / 1024) + 'MB',
        heapTotal: Math.round(used.heapTotal / 1024 / 1024) + 'MB',
        heapUsed: Math.round(used.heapUsed / 1024 / 1024) + 'MB'
    });
}, 30000);
