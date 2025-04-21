import express, { Request, Response } from 'express';
import multer from 'multer';
import { auth } from '../middleware/auth';
import { validateContentType } from '../middleware/contentType';
import { restrictMethods } from '../middleware/methodRestriction';
import Resume from '../models/Resume';
import { Job } from '../models/Job';
import { calculateMatchScore, getCachedMatchScore, cacheMatchScore } from '../services/matchScore';
import '../types/express'; // Import the type declarations
import { JwtPayload } from 'jsonwebtoken';

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
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
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const router = express.Router();

// Upload and parse resume - Only allow POST
router.post('/upload', 
  restrictMethods(['POST']),
  auth, 
  validateContentType(['multipart/form-data']),
  upload.single('resume'), 
  async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
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
      
      res.json({ 
        message: 'Resume uploaded successfully',
        resumeId: resume._id,
        keywords 
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  }
);

// Get match score - Only allow GET
router.get('/:resumeId/match/:jobId', 
  restrictMethods(['GET']),
  auth, 
  async (req, res) => {
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
  }
);

export default router; 