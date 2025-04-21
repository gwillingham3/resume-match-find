import { Router } from 'express';
import { auth } from '../middleware/auth';
import { validateContentType } from '../middleware/contentType';
import { restrictMethods } from '../middleware/methodRestriction';
import { Job } from '../models/Job';
import { RouteHandler } from '../types/express';

const router = Router();

// Search jobs - Only allow POST
const searchJobs: RouteHandler = async (req, res) => {
  try {
    const { keywords } = req.body as { keywords: string[] };
    
    if (!keywords || !Array.isArray(keywords)) {
      res.status(400).json({ error: 'Keywords must be an array' });
      return;
    }
    
    const jobs = await Job.find({
      $or: keywords.map(keyword => ({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { requirements: { $regex: keyword, $options: 'i' } }
        ]
      }))
    });
    
    res.json(jobs);
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get job by ID - Only allow GET
const getJobById: RouteHandler = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

router.post('/search', 
  restrictMethods(['POST']),
  auth, 
  validateContentType(['application/json']),
  searchJobs
);

router.get('/:id', 
  restrictMethods(['GET']),
  auth, 
  getJobById
);

export default router; 