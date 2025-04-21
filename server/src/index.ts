import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { checkDbConnection } from './middleware/dbConnection';
import logger, { stream } from './config/logger';

// Routes
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import resumeRoutes from './routes/resume';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Create logs directory if it doesn't exist
import fs from 'fs';
import path from 'path';
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Middleware
app.use(cors());
app.use(express.json());

// HTTP request logging
app.use(morgan('combined', { stream }));

// Global method restriction middleware
app.use((req, res, next) => {
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  if (!allowedMethods.includes(req.method)) {
    logger.warn(`Method not allowed: ${req.method} ${req.url}`);
    res.status(405).json({ 
      error: 'Method Not Allowed',
      message: `Only ${allowedMethods.join(', ')} methods are supported`
    });
    return;
  }
  next();
});

// Database connection check middleware
app.use(checkDbConnection);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resume', resumeRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', { 
    error: err.message, 
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB with retry logic
const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobmatch', {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      logger.info('Connected to MongoDB');
      app.listen(port, () => {
        logger.info(`Server running on port ${port}`);
      });
      return;
    } catch (error) {
      logger.error(`MongoDB connection attempt ${i + 1} failed:`, { error });
      if (i < retries - 1) {
        logger.info(`Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        logger.error('Failed to connect to MongoDB after all retries');
        process.exit(1);
      }
    }
  }
};

connectWithRetry(); 