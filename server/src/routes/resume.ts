import express from 'express';
import multer from 'multer';
import { composeMiddleware } from '../middleware/compose';
import Resume from '../models/Resume';
import { Job } from '../models/Job';
import { calculateMatchScore, getCachedMatchScore, cacheMatchScore } from '../services/matchScore';
import { JwtPayload } from 'jsonwebtoken';
import { RouteHandler } from '../types/express';
import { User } from '../models/User';
import redisClient from '../config/redis'; // Import redisClient
import AWS from 'aws-sdk';

// Configure AWS SDK

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

let bucketName = process.env.AWS_S3_BUCKET_NAME;

if (!bucketName) {
  console.error('AWS_S3_BUCKET_NAME environment variable is not set.');
  process.exit(1);
}

const s3 = new AWS.S3();

const router = express.Router();

// Generate presigned URL - Only allow GET
const generatePresignedUrl: RouteHandler = async (req, res) => {
  try {
    const { filename, contentType } = req.query;

    if (!filename || !contentType) {
      res.status(400).json({ error: 'Filename and contentType are required' });
      return;
    }

    const key = `resumes/${Date.now()}-${filename}`;

    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: 600, // 10 minutes
    };

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);

    console.log('Generated Presigned URL:', uploadURL);

    res.json({ uploadURL, key });
  } catch (error) {
    console.error('Presigned URL error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

/*
// Upload and parse resume - Only allow POST
const uploadResume: RouteHandler = async (req, res) => {
  console.log('Upload resume request received:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    file: req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : null,
    user: req.user
  });

  try {
    if (!req.file) {
      console.log('No file uploaded');
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    if (!req.user) {
      console.log('No user found in request');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Upload file to S3
    const params = {
      Bucket: bucketName,
      Key: `resumes/${Date.now()}-${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const s3UploadResult = await s3.upload(params).promise();

    // Save resume
    const resume = new Resume({
      userId: (req.user as JwtPayload & { id: string }).id,
      file: {
        data: s3UploadResult.Key, // Store S3 object key
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        size: req.file.size
      },
      parsedData: {
        keywords: [], // Will be populated after parsing
        skills: [],  // Will be populated after parsing
        education: [],
        experience: [],
        personalInfo: {}
      },
      status: {
        isProcessed: false,
        lastProcessed: new Date()
      },
      metadata: {
        uploadedAt: new Date(),
        lastUpdated: new Date(),
        version: 1
      },
      settings: {
        isPublic: false,
        allowKeywordExtraction: true,
        preferredJobTypes: []
      },
      jobPreferences: {
        desiredRole: [],
        desiredIndustries: [],
        workType: [],
        experienceLevel: 'entry'
      },
      applications: []
    });
    
    await resume.save();
    
    // Queue resume processing task
    if (redisClient) {
      const resumeId = resume._id.toString();
      await redisClient.rpush('resume_processing_queue', resumeId);
      console.log(`Resume processing task queued for resumeId: ${resumeId}`);
    } else {
      console.warn('Redis client not available, processing resume synchronously');
      // Extract keywords (implement your parsing logic here)
      const keywords = ['React', 'JavaScript', 'Node.js']; // Example keywords
      
      // Update the resume with extracted keywords
      resume.parsedData.keywords = keywords;
      resume.status.isProcessed = true;
      await resume.save();
    }

    // Update user's resumeIds array
    const userId = (req.user as JwtPayload & { id: string }).id;
    await User.findByIdAndUpdate(userId, {
      $push: { resumeIds: resume._id },
    });
    
    res.json({
      message: 'Resume uploaded successfully',
      resumeId: resume._id,
      keywords: [] // Return empty keywords since processing is asynchronous
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
};
*/

// Get match score - Only allow GET
const getMatchScore: RouteHandler = async (req, res) => {
  try {
    const { resumeId, jobId } = req.params;
    
    // Check if user owns the resume
    let resume = await Resume.findOne({ _id: resumeId, userId: (req.user as JwtPayload & { id: string }).id });
    if (!resume) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }
    
    // Get the job
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    // Get file from S3
    const params = {
      Bucket: bucketName,
      Key: resume.file.data,
    };

    try {
      const s3GetObjectResult = await s3.getObject(params).promise();
      const fileData = s3GetObjectResult.Body ? s3GetObjectResult.Body.toString() : null;

      if (!fileData) {
        console.error('Error getting file from S3: Empty file data');
        res.status(500).json({ error: 'Error getting file from S3: Empty file data' });
        return;
      }

      // Parse the file data into a Resume object
      const parsedResumeData = JSON.parse(fileData);

      // Update the existing resume with the parsed data
      Object.assign(resume, parsedResumeData);

      // Try to get cached score
      let score = await getCachedMatchScore(resumeId, jobId);

      // If no cached score, calculateMatchScore(resume, job, fileData);
      if (!score) {
        score = await calculateMatchScore(resume, job);
        await cacheMatchScore(resumeId, jobId, score);
      }

      res.json(score);
    } catch (s3Error) {
      console.error('Error getting file from S3:', s3Error);
      res.status(500).json({ error: 'Error getting file from S3' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Register routes
router.get('/presigned',
  composeMiddleware({
    methods: ['GET'],
    requireAuth: true
  }),
  generatePresignedUrl
);

/*
router.post('/upload',
  composeMiddleware({
    methods: ['POST'],
    requireAuth: true,
    rateLimit: {
      windowMs: 60000,
      max: 5,
    },
  }),
  upload.single('resume'),
  uploadResume
);
*/

// Save resume metadata - Only allow POST
const saveResumeMetadata: RouteHandler = async (req, res) => {
  try {
    const key = req.body.data.key;
    const userId = req.body.data.userId;
    const contentType = req.body.data.contentType;
    const contentLength = req.body.data.contentLength;

    if (!key || !userId || !contentType || !contentLength) {
      console.log('saveResumeMetadata error: Key, userId, contentType and contentLength are required');
      res.status(400).json({ error: 'Key, userId, contentType and contentLength are required' });
      return;
    }

    // Save resume
    const resume = new Resume({
      userId: userId,
      file: {
        data: key, // Store S3 object key
        filename: key.split('/').pop(),
        contentType: contentType,
        size: contentLength
      },
      parsedData: {
        keywords: [], // Will be populated after parsing
        skills: [],  // Will be populated after parsing
        education: [],
        experience: [],
        personalInfo: {}
      },
      status: {
        isProcessed: false,
        lastProcessed: new Date()
      },
      metadata: {
        uploadedAt: Date.now(),
        lastUpdated: Date.now(),
        version: 1
      },
      settings: {
        isPublic: false,
        allowKeywordExtraction: true,
        preferredJobTypes: []
      },
      jobPreferences: {
        desiredRole: [],
        desiredIndustries: [],
        workType: [],
        experienceLevel: 'entry'
      },
      applications: []
    });
    
    await resume.save();
    
    // Queue resume processing task
    if (redisClient) {
      const resumeId = resume._id.toString();
      await redisClient.rpush('resume_processing_queue', resumeId);
      console.log(`Resume processing task queued for resumeId: ${resumeId}`);
    } else {
      console.warn('Redis client not available, processing resume synchronously');
      // Extract keywords (implement your parsing logic here)
      const keywords = ['React', 'JavaScript', 'Node.js']; // Example keywords
      
      // Update the resume with extracted keywords
      resume.parsedData.keywords = keywords;
      resume.status.isProcessed = true;
      await resume.save();
    }

    // Update user's resumeIds array
    await User.findByIdAndUpdate(userId, {
      $push: { resumeIds: resume._id },
    });
    
    res.json({
      message: 'Resume uploaded successfully',
      resumeId: resume._id,
      keywords: [] // Return empty keywords since processing is asynchronous
    });
  } catch (error) {
    console.error('Resume metadata error:', error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

router.post('/metadata',
  composeMiddleware({
    methods: ['POST'],
    requireAuth: false,
    rateLimit: {
      windowMs: 60000,
      max: 5,
    },
  }),
  saveResumeMetadata
);
console.log('Reached /metadata route');

router.get('/:resumeId/match/:jobId', 
  composeMiddleware({
    methods: ['GET'],
    requireAuth: true
  }),
  getMatchScore
);

export default router;
