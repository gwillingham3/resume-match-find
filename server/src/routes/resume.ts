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
import { parseResume } from '../utils/resumeParser'; // Import resume parser

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

    let keywords: string[] = [];
    try {
      const s3GetObjectResult = await s3
        .getObject({
          Bucket: bucketName,
          Key: key,
        })
        .promise();

      const fileBuffer = s3GetObjectResult.Body as Buffer;

      keywords = await parseResume(fileBuffer, contentType);
      console.log("here are the keywords from the parsed resume: " + keywords);

      // Update the resume with extracted keywords
      resume.parsedData.keywords = keywords;
      resume.status.isProcessed = true;
      await resume.save();

    } catch (error: any) {
      console.error('Error parsing resume:', error);
      resume.status.isProcessed = false;
      await resume.save();
    }
    
    // Queue resume processing task
    if (redisClient) {
      const resumeId = resume._id.toString();
      await redisClient.rpush('resume_processing_queue', resumeId);
      console.log(`Resume processing task queued for resumeId: ${resumeId}`);
    } else {
      console.warn('Redis client not available, processing resume synchronously');
      // Extract keywords (implement your parsing logic here)
      resume.parsedData.keywords = ['fallback keyword'];
      resume.status.isProcessed = true;
    }

    // Update user's resumeIds array
    await User.findByIdAndUpdate(userId, {
      $push: { resumeIds: resume._id },
    });
    
    res.json({
      message: 'Resume uploaded successfully',
      resumeId: resume._id,
      keywords: keywords
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

router.get('/:resumeId/match/:jobId',
  composeMiddleware({
    methods: ['GET'],
    requireAuth: true
  }),
  getMatchScore
);

export default router;
