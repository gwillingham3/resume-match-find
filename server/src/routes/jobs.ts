import express from 'express';
import { Job } from '../models/Job';
import { auth } from '../middleware/auth';

const router = express.Router();

// Search jobs
router.post('/search', auth, async (req, res) => {
  try {
    const { keywords } = req.body;
    
    // Search jobs based on keywords
    const jobs = await Job.find({
      $or: [
        { title: { $in: keywords.map(k => new RegExp(k, 'i')) } },
        { description: { $in: keywords.map(k => new RegExp(k, 'i')) } },
        { skills: { $in: keywords } },
      ],
    });
    
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get job by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ job });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 