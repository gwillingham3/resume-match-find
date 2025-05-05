import express from 'express';
import multer from 'multer';
import { composeMiddleware } from '../middleware/compose';
import Resume from '../models/Resume';
import { Job } from '../models/Job';
import { calculateMatchScore, getCachedMatchScore, cacheMatchScore } from '../services/matchScore';
import { JwtPayload } from 'jsonwebtoken';
import { RouteHandler } from '../types/express';
import { User } from '../models/User';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
  }
});

const router = express.Router();

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
    
    // Save resume
    const resume = new Resume({
      userId: (req.user as JwtPayload & { id: string }).id,
      file: {
        data: req.file.buffer,
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
    
    // Extract keywords (implement your parsing logic here)
    const keywords = ['React', 'JavaScript', 'Node.js']; // Example keywords
    
    // Update the resume with extracted keywords
    resume.parsedData.keywords = keywords;
    resume.status.isProcessed = true;
    await resume.save();

    // Update user's resumeIds array
    const userId = (req.user as JwtPayload & { id: string }).id;
    await User.findByIdAndUpdate(userId, {
      $push: { resumeIds: resume._id },
    });
    
    res.json({
      message: 'Resume uploaded successfully',
      resumeId: resume._id,
      keywords
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

// Get match score - Only allow GET
const getMatchScore: RouteHandler = async (req, res) => {
  try {
    const { resumeId, jobId } = req.params;
    
    // Check if user owns the resume
    const resume = await Resume.findOne({ _id: resumeId, userId: (req.user as JwtPayload & { id: string }).id });
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
    
    // Try to get cached score
    let score = await getCachedMatchScore(resumeId, jobId);
    
    // If no cached score, calculate and cache it
    if (!score) {
      score = await calculateMatchScore(resume, job);
      await cacheMatchScore(resumeId, jobId, score);
    }
    
    res.json(score);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Register routes
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

router.get('/:resumeId/match/:jobId', 
  composeMiddleware({
    methods: ['GET'],
    requireAuth: true
  }),
  getMatchScore
);

export default router;
